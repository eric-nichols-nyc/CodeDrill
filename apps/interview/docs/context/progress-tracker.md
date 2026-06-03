# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- **Interview Generator** — P0 planning (spec: [03-interview-generation.md](../feature-specs/03-interview-generation.md))

## Current Goal

- Replace dev seed with AI-backed `POST /interview/sessions` (profile + job analysis → blueprint + 5–10 questions + expected signals)

## In Progress

- Interview Generator P0 — lock API contract, AI prompt shape, and implementation phases (mirror job-analysis slice)

## Session Notes

- **Routes:** prototype mock at `/prototype` (public); real flow at `/interviews` → `/interviews/start` → `/interviews/[id]/play|complete` (Clerk-protected).
- **Question Player Gate 2 signed off:** seed → play → complete E2E; dev seed via `POST /interview/sessions/seed` on `/interviews/start`.
- **Question Player Gate 1 signed off:** TTS + STT voice flow works in browser.
- **Job Analysis shipped:** DB `interview_job_analyses`, Nest API, `/job-analysis` UI — branches `feature/interview-job-analysis` / `-P2` / `-P3`.
- **P3 complete:** `/job-analysis` page, workspace UI, server actions, nav + Clerk protect.
- **P2 complete:** Nest `interview-job-analysis` module — generate, save, GET me/id; `api-contracts.md` updated.
- **P1 complete:** `interview_job_analyses` in `schema.ts`, migration `0006` applied on Neon.
- **P0 complete:** decisions locked, doc alignment, migrate + typecheck verified.
- Initial scaffold: Next zone app at `apps/interview`, port 3012.
- Link from `apps/app` landing header via `NEXT_PUBLIC_INTERVIEW_URL`.

## Completed

- route cleanup — `/prototype` for mock flow; `/interviews/*` for player; orphaned empty route dirs removed
- question player Gate 2 — session tables, Nest `interview/sessions/*`, player submit/nav/complete UI, `/interviews/start` seed entry
- question player Gate 1 — TTS question, STT → textarea, mic permission, re-record replace (`features/interview-player`)
- job analysis vertical slice — full stack P0–P3 (no formal P4 prompt QA pass)
- job analysis P3 — `/job-analysis` UI + `features/job-analysis/actions.ts`
- job analysis P2 — `interview/job-analyses/*` API (generate, save, GET me, GET by id)
- job analysis P1 — `interview_job_analyses` Drizzle + migration `0006`
- job analysis P0 — decisions locked, doc alignment
- interview profile slice — `interview_resumes` + `interview_candidate_profiles`, Nest `interview/profiles/*`, `/profile` workspace UI
- interview auth — Clerk in `apps/interview` (`ClerkProvider`, `proxy.ts`, `/sign-in`, `apiAuthHeaders`)
- interview zone — app scaffold, design-system shell, static landing + 5 MVP screens
- interview docs — planning, architecture, [03-job-analysis-implementation.md](../implementation/03-job-analysis-implementation.md)
- monorepo — `apps/interview` in agent scope; `pnpm dev:interview` script

## Next Up

### Interview Generator (current)

1. **P0** — Decisions: `POST /interview/sessions/generate` (preview) + `POST /interview/sessions` (persist), or single-step create; reuse existing `interview_sessions` / `interview_questions` columns; stub vs OpenAI (follow job-analysis pattern).
2. **P1** — Schema/migration only if new columns needed (e.g. `follow_up_opportunities`, blueprint JSON).
3. **P2** — Nest `interview-session-generate.service.ts` + controller routes; structured output validation.
4. **P3** — `/interviews/start` UI: replace seed button with generate → overview → start play (wire prototype Screen 1 / overview).

### Later

- Answer Evaluation (Gate 3 for question player)
- Final Report
- Multi-zone rewrites on `apps/app` (single origin)
- Profile edit UI (inline PATCH) and file upload on `interview_resumes`

## Open Questions

From [prd.md](../prd.md):

- Feedback after every question vs end-only?
- Show transcript to user?
- Retryable answers?
- Follow-up questions in MVP?
- Timed interviews?
- Skip questions allowed?

## Architecture Decisions

- **Zone app** at `apps/interview` (not nested under `apps/app`)
- **Prototype-first** — `/prototype` mock flow public; `/profile`, `/job-analysis`, and `/interviews/*` authenticated
- **Job Analysis table** — physical `interview_job_analyses`; logical `job_analyses` in architecture docs
- **Job Analysis API** — `/interview/job-analyses`; contract from data-contracts §2
- **Job Analysis company/role** — AI extract on generate; optional UI override before save
- **Job Analysis UI** — `/job-analysis` workspace (Option A)
- **Job Analysis history** — latest-only via `GET .../me`
