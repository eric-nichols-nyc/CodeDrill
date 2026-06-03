# Job Analysis — implementation plan

**Goal:** Ship the Job Analysis vertical slice: paste JD → AI extract → review → save → reload by id — mirroring the Profile slice pattern.

**Feature spec:** [02-job-analysis.md](../feature-specs/02-job-analysis.md)

**Contract authority:** [data-contracts.md](../architecture/data-contracts.md) §2 (`JobAnalysis`) — not the simplified shape in [07-ai-flow.md](../feature-specs/07-ai-flow.md) Flow 2 (update that doc when this ships).

**Depends on:** Clerk auth + `interviewApiFetch` (same as Profile); Profile E2E validated on Neon (recommended before merge, not a data dependency).

**Blocks:** Interview Generator (`interview_sessions` + `job_analysis_id` FK).

**Out of scope for this plan:** Interview questions, scoring, resume↔JD comparison, `interview_sessions`, job URL scraping, PATCH/edit API (unless added in a follow-up).

---

## Architecture decisions (lock before coding)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Physical table name | **`interview_job_analyses`** | Matches `interview_resumes`, `interview_candidate_profiles` ([database.md](../architecture/database.md) § Existing database context — `interview_` prefix). Logical name in docs remains `job_analyses`. |
| API route prefix | **`/interview/job-analyses`** | Parallel to `/interview/profiles`. |
| Contract source | **data-contracts §2** | Full field set + nested types; prevents drift from `07-ai-flow.md`. |
| `companyName` / `roleTitle` | **AI extracts from JD on generate; UI may override before save** | Satisfies optional UI inputs + DB NOT NULL ([database.md](../architecture/database.md) §3). Reject save if either is empty after trim. |
| Unsaved extraction | **Transient** | Generate does not persist; client holds preview until POST save ([database.md](../architecture/database.md) § transient). |
| Re-analysis | **New row per save** | MVP: no upsert; history via `(user_id, created_at DESC)` index. |
| Latest vs list | **`GET .../me` only for MVP** | Match Profile; defer list/history UI unless product requests picker. |
| Dev without OpenAI | **Stub payload when `OPENAI_API_KEY` unset** | Same pattern as `InterviewProfileGenerateService`. |

---

## Acceptance criteria (implementation checklist)

Map to [02-job-analysis.md](../feature-specs/02-job-analysis.md).

- [ ] **P0** Table naming + `companyName`/`roleTitle` rule recorded (this doc + progress tracker).
- [ ] **P1** Migration `0006` + Drizzle `interview_job_analyses` in `apps/api/src/database/schema.ts`.
- [ ] **P1** `JobAnalysisPayloadDto` validates all contract fields (nested DTOs, array bounds).
- [ ] **P2** `POST /interview/job-analyses/generate` returns valid payload (AI or stub).
- [ ] **P2** `POST /interview/job-analyses` persists `source_text` + structured columns; returns view with `id`, timestamps.
- [ ] **P2** `GET /interview/job-analyses/me` and `GET /interview/job-analyses/:id` (owner-only).
- [ ] **P2** [api-contracts.md](../architecture/api-contracts.md) documents Job Analysis endpoints.
- [ ] **P3** Interview app types + server actions + UI: generate → preview → save → reload.
- [ ] **P4** Manual QA: `mustProve` / `hiddenExpectations` quality on 3+ real JDs.
- [ ] **P4** Generator-ready: `GET :id` returns complete `JobAnalysis` without re-running generate.
- [ ] **Boundaries** No question text, scores, or resume comparison in this module.

---

## Phase 0 — Prerequisites

**Owner:** Any engineer starting the slice.

1. Confirm Profile slice on Neon: `pnpm db:migrate` in `apps/api`, Clerk + API + interview dev, `/profile` generate → save → reload.
2. Read reference implementation:
   - `apps/api/src/interview-profile/*`
   - `apps/interview/features/profile/actions.ts`
   - `apps/interview/lib/interview-api/*`
3. Fix doc drift (can be same PR as Phase 1):
   - Align [07-ai-flow.md](../feature-specs/07-ai-flow.md) Flow 2 output with data-contracts §2.
   - Note in [database.md](../architecture/database.md) that physical tables use `interview_*` prefix (logical `job_analyses` → `interview_job_analyses`).

**Exit:** Profile pattern understood; decisions table above agreed.

---

## Phase 1 — Data layer (`apps/api`)

### 1.1 Drizzle schema

Add `interview_job_analyses` to `apps/api/src/database/schema.ts`:

| Column (DB) | Type | Contract field |
|-------------|------|----------------|
| `id` | uuid PK | `id` |
| `user_id` | text NOT NULL | tenancy (Clerk `sub`) |
| `source_text` | text NOT NULL | raw `jobDescription` |
| `source_url` | text nullable | optional `jobUrl` |
| `company_name` | text NOT NULL | `companyName` |
| `role_title` | text NOT NULL | `roleTitle` |
| `role_summary` | text NOT NULL | `roleSummary` |
| `required_skills` | text[] NOT NULL | `requiredSkills` |
| `nice_to_have_skills` | text[] NOT NULL | `niceToHaveSkills` |
| `seniority_level` | jsonb NOT NULL | `seniorityLevel` `{ level, confidence }` |
| `likely_interview_categories` | text[] NOT NULL | `likelyInterviewCategories` |
| `must_prove` | text[] NOT NULL | `mustProve` |
| `hidden_expectations` | jsonb NOT NULL | `HiddenExpectation[]` |
| `interview_signals` | text[] NOT NULL | `interviewSignals` |
| `suggested_question_angles` | jsonb NOT NULL | `SuggestedQuestionAngle[]` |
| `created_at` / `updated_at` | timestamptz | `createdAt` / `updatedAt` |

**Index:** `(user_id, created_at DESC)` — `interview_job_analyses_user_id_created_at_idx`.

Export in `schema` object alongside existing interview tables.

### 1.2 Migration

- File: `apps/api/drizzle/0006_interview_job_analyses.sql` (next sequential number if repo differs).
- Run: `pnpm db:migrate` from `apps/api` against Neon.

**Exit:** Table exists; Drizzle types compile.

---

## Phase 2 — API (`apps/api`)

### 2.1 Module layout

Mirror `interview-profile`:

```
apps/api/src/interview-job-analysis/
  interview-job-analysis.module.ts
  interview-job-analysis.controller.ts
  interview-job-analysis.service.ts          # persistence + ownership
  interview-job-analysis-generate.service.ts # OpenAI + validation
  interview-job-analysis.constants.ts        # model, system prompt
  dto/job-analysis-payload.dto.ts
```

Register `InterviewJobAnalysisModule` in `app.module.ts`.

### 2.2 DTOs (`job-analysis-payload.dto.ts`)

- `SeniorityLevelDto` — `level`, `confidence` (`"Low" | "Medium" | "High"`).
- `HiddenExpectationDto` — `expectation`, `reason`.
- `SuggestedQuestionAngleDto` — `category`, `angle`.
- `JobAnalysisPayloadDto` — all structured fields (no `id`/timestamps).
- `GenerateJobAnalysisDto` — `jobDescription` (required, max length e.g. 200k), optional `jobUrl`, `companyName`, `roleTitle`.
- `SaveJobAnalysisDto` — `jobDescription`, optional `jobUrl`, optional overrides + `JobAnalysisPayloadDto` fields (or nested payload — match Profile’s `SaveProfileDto` shape).

Use `class-validator` + `class-transformer` with bounds similar to `profile-payload.dto.ts`.

### 2.3 Generate service

- `POST generate` → `generateFromJobDescription(dto)`.
- System prompt must instruct:
  - Hiring-manager lens (not JD summary).
  - Strong **`mustProve`** (demonstrable competencies).
  - **`hiddenExpectations`** with **`reason`**.
  - **`suggestedQuestionAngles`** — directions only, **not** full interview questions.
  - Extract **`companyName`** and **`roleTitle`** from JD when not provided in request.
- OpenAI: `response_format: { type: "json_object" }`, low temperature, reuse `openai-completion.util.ts`.
- Validate with `JobAnalysisPayloadDto`; `422` on failure; `502` on upstream errors.
- Stub when `OPENAI_API_KEY` missing (valid minimal JSON + dev message in `roleSummary`).

### 2.4 Persistence service

- `saveForUser(userId, input)` — INSERT `interview_job_analyses`, map snake_case ↔ camelCase in view type `JobAnalysisView`.
- `getLatestForUser(userId)` — ORDER BY `created_at DESC` LIMIT 1.
- `getByIdForUser(userId, id)` — 404 / 403 pattern from Profile.

### 2.5 Controller

| Method | Path | Code | Notes |
|--------|------|------|-------|
| `POST` | `/interview/job-analyses/generate` | 200 | No DB write |
| `POST` | `/interview/job-analyses` | 201 | Save |
| `GET` | `/interview/job-analyses/me` | 200 | `null` if none |
| `GET` | `/interview/job-analyses/:jobAnalysisId` | 200 | UUID param |

`@UseGuards(ProblemsUserGuard)` on controller.

### 2.6 API contracts doc

Add **Job Analysis System** section to [api-contracts.md](../architecture/api-contracts.md) (same table format as Profile).

**Exit:** curl/Postman or integration test: generate → save → GET me → GET by id.

---

## Phase 3 — Interview app (`apps/interview`)

### 3.1 Types

Extend `apps/interview/lib/interview-api/types.ts`:

- `SeniorityLevel`, `HiddenExpectation`, `SuggestedQuestionAngle`
- `JobAnalysisPayload`
- `JobAnalysis` (= payload + `id`, `createdAt`, `updatedAt`)

### 3.2 Server actions

`apps/interview/features/job-analysis/actions.ts` (or `features/job-analysis/actions.ts`):

- `generateJobAnalysisAction`
- `saveJobAnalysisAction`
- `getLatestJobAnalysisAction`

Mirror `ProfileActionResult<T>` error handling (`401` → sign-in message).

### 3.3 UI (pick one for MVP)

| Option | Route / surface | Pros |
|--------|-----------------|------|
| **A (recommended for E2E)** | `/job-analysis` workspace | Fast parity with `/profile`; isolated testing |
| **B** | Wire `screen-create-interview.tsx` JD block | Keeps create funnel; more coupling to generator later |

**Minimum UI states:**

1. Textarea + optional company/role/URL.
2. Generate → loading → preview (accordion or cards: skills, mustProve, hidden expectations, angles).
3. Save → success + show `id`.
4. Reload on mount via `GET me` (like profile workspace).

Defer: history list, PATCH edit, overview accordion real data until create flow passes ids.

### 3.4 Navigation

Add link from shell / profile area if using Option A; document in progress tracker.

**Exit:** Signed-in user completes generate → save → refresh → sees same analysis.

---

## Phase 4 — Quality & handoff to Generator

1. **Prompt QA** — Run 3–5 real JDs (senior IC, staff, sparse posting, title/company only in body). Review `mustProve` and `hiddenExpectations` with PM or self-review rubric from [02-job-analysis.md](../feature-specs/02-job-analysis.md) guiding principle.
2. **Contract check** — Response JSON keys must match data-contracts exactly (no `interviewCategories` alias).
3. **Generator input** — Document sample `jobAnalysisId` + payload shape for Interview Generator implementer (Flow 3); no generator code in this slice.
4. **Progress tracker** — Mark Job Analysis slice complete; set Next Up to Interview Generator or Screen 1 wiring.

---

## Explicitly deferred

| Item | Stage |
|------|--------|
| `interview_sessions` + `job_analysis_id` FK | Interview Generator |
| `PATCH /interview/job-analyses/:id` | Post-MVP unless edit required before interview |
| `GET` list / history picker | Post-MVP |
| Job URL fetch / scrape into `source_url` | Future |
| Replace `mockJobAnalysis` in overview accordion | After create flow stores real id |
| Multi-zone rewrites on `apps/app` | Infra |

---

## File touch list (expected)

| App | Files (new or edit) |
|-----|---------------------|
| `apps/api` | `drizzle/0006_*.sql`, `schema.ts`, `interview-job-analysis/*`, `app.module.ts` |
| `apps/interview` | `lib/interview-api/types.ts`, `features/job-analysis/*`, `app/job-analysis/page.tsx` (if Option A) |
| `apps/interview/docs` | `api-contracts.md`, `07-ai-flow.md`, `progress-tracker.md`, optional `database.md` naming note |

---

## Open questions (resolve in Phase 0)

1. **UI Option A vs B** — Dedicated `/job-analysis` vs only Screen 1?
2. **Require company/role in form** — Or AI-only with optional override (default: AI + override)?
3. **History list in MVP** — Default no; add endpoint only if product needs picker before Generator.

---

## Suggested PR sequence

1. **PR1:** Phase 0 doc fixes + Phase 1 migration/schema (no API).
2. **PR2:** Phase 2 Nest module + api-contracts.
3. **PR3:** Phase 3 interview types/actions/UI.
4. **PR4 (optional):** Prompt tuning only, or fold into PR2/PR3.

---

## References

| Doc | Use |
|-----|-----|
| [02-job-analysis.md](../feature-specs/02-job-analysis.md) | Product outputs + acceptance criteria |
| [data-contracts.md](../architecture/data-contracts.md) §2 | `JobAnalysis` TypeScript contract |
| [database.md](../architecture/database.md) §3 | Column mapping (logical `job_analyses`) |
| [api-contracts.md](../architecture/api-contracts.md) | BFF HTTP table (Profile template) |
| Profile code in `apps/api/src/interview-profile/` | Implementation template |
