# Database Architecture — AI Interview Coach MVP

Conceptual schema design for persisting the AI Interview Coach pipeline in the **existing CodeDrill Postgres database** (`apps/api`). This document defines entities, relationships, and storage boundaries. It does not prescribe ORM models, SQL, or migration files.

**Sources:** [data-contracts.md](./data-contracts.md), feature specs 01–06, [project-overview.md](../context/project-overview.md).

---

## Design principles

1. **Map to contracts, not to every nested TypeScript interface.** Nested shapes (`ProjectExperience`, `HiddenExpectation`, etc.) are stored as structured JSON within parent rows — not as separate tables.
2. **One row per question lifecycle.** `QuestionSessionRecord` in the data contracts is a join of question + answer + evaluation. The database mirrors that as a single `interview_questions` row that gains answer and evaluation columns over time.
3. **No blueprint table.** `InterviewBlueprint` is a generation artifact; its metadata lives on `interview_sessions` and its questions on `interview_questions`.
4. **Reuse existing tenancy patterns.** CodeDrill practice tables use `user_id` (`text`, Clerk subject). Interview tables follow the same convention.
5. **Prefer immutability for generated content.** Questions are a snapshot at generation time. Answers and evaluations are append-once per question (MVP does not re-evaluate).

---

## Existing database context

The shared Postgres instance already holds CodeDrill practice data (`problems`, `submissions`, `problem_progress`, etc.) in `apps/api/src/database/schema.ts`. Interview Coach tables are **additive** — new tables in the same database, namespaced with an `interview_` prefix (or equivalent) to avoid collision with practice entities.

No changes to existing practice tables are required for MVP.

---

## High-level entity relationship overview

```txt
User (Clerk — external, not a table)
  │
  ├── resumes (1:N)
  │     └── candidate_profiles (1:1 or 1:N per resume; MVP: 1 active profile per resume)
  │
  ├── job_analyses (1:N)
  │
  └── interview_sessions (1:N)
        ├── candidate_profiles (N:1) ── provenance
        ├── job_analyses (N:1) ─────── provenance
        ├── interview_questions (1:N) ─ question + answer + evaluation
        └── interview_reports (1:1) ── final report
```

**Core flow:** Resume → Profile. Job description text → Job Analysis. Profile + Job Analysis → Interview Session (with generated questions). Candidate answers and evaluations accumulate on question rows. Completed session → Final Report.

---

## What to persist

| Data | Persist? | Where |
|------|----------|-------|
| Resume file metadata & storage reference | Yes | `resumes` |
| Extracted resume text | Yes | `resumes.extracted_text` |
| Structured candidate profile (editable) | Yes | `candidate_profiles` |
| Raw job description text | Yes | `job_analyses.source_text` |
| Structured job analysis | Yes | `candidate_profiles`-style columns + JSON on `job_analyses` |
| Interview session lifecycle & blueprint metadata | Yes | `interview_sessions` |
| Generated questions (immutable snapshot) | Yes | `interview_questions` (question columns) |
| Candidate answers (transcript, mode, timing) | Yes | `interview_questions` (answer columns) |
| Per-question evaluation results | Yes | `interview_questions` (evaluation columns) |
| Final report | Yes | `interview_reports` |

---

## What is transient (do NOT store)

| Data | Reason |
|------|--------|
| Raw voice audio blobs | Large binary; use object storage if retained at all. MVP may discard after transcription. DB stores transcript only. |
| In-progress transcription / draft answer text | Client or short-lived cache until submit |
| LLM streaming tokens & partial outputs | Ephemeral; only structured final output is persisted |
| Full prompt payloads & system instructions | Reconstruct from versioned prompt code; not user data |
| `AnswerEvaluationInput` | Assembled at evaluation time from question row fields |
| `InterviewSession` as a runtime aggregate | Reconstructed by joining session + questions (+ report) |
| UI derivations (letter grades, per-question rollup tables) | Computed in the app from stored scores |
| AI job queue / retry state | Use worker memory or a job queue in a future phase; not MVP |
| Parsed-but-unsaved profile or job analysis | Hold in request/session until user confirms save |
| Duplicate `interviewId` separate from session PK | MVP: session `id` **is** the contract's `interviewId` |

---

## Entity definitions

### 1. `resumes`

#### Purpose

Tracks uploaded resume files and the text extracted from them. Separates the **source artifact** from the **derived profile**, enabling re-extraction, audit, and optional file re-download without re-upload.

#### Fields

| Field | Type (conceptual) | Notes |
|-------|-------------------|-------|
| `id` | UUID, PK | |
| `user_id` | text, NOT NULL | Clerk subject; tenant boundary |
| `file_name` | text, NOT NULL | Original filename |
| `mime_type` | text, NOT NULL | e.g. `application/pdf` |
| `file_size_bytes` | integer, NOT NULL | |
| `storage_key` | text, NOT NULL | Object storage path (S3, Vercel Blob, etc.) — not the file bytes |
| `extracted_text` | text | Populated after parse; nullable until extraction completes |
| `parse_status` | enum | `pending`, `succeeded`, `failed` |
| `parse_error` | text | Nullable; set when `parse_status = failed` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

#### Relationships

- **Has many** `candidate_profiles` (typically one active profile per resume in MVP)
- **Belongs to** user (via `user_id`)

#### Notes

- File bytes live in object storage; the database holds metadata and extracted text only.
- If extraction fails, the row still exists so the user can retry without re-uploading.

---

### 2. `candidate_profiles`

#### Purpose

Persisted structured representation of a candidate derived from a resume (`CandidateProfile` contract). Editable by the user after AI extraction. Primary input to the Interview Generator alongside job analysis.

#### Fields

| Field | Type (conceptual) | Maps to contract |
|-------|-------------------|------------------|
| `id` | UUID, PK | `CandidateProfile.id` |
| `user_id` | text, NOT NULL | Tenancy |
| `resume_id` | UUID, FK → `resumes.id` | Provenance |
| `summary` | text, NOT NULL | `summary` |
| `core_skills` | text[] | `coreSkills` |
| `projects` | JSONB | `ProjectExperience[]` — `{ name, role, claims[] }` |
| `claims_to_verify` | JSONB | `ResumeClaim[]` — `{ claim, questionAngle }` |
| `strength_areas` | text[] | `strengthAreas` |
| `potential_gap_areas` | text[] | `potentialGapAreas` |
| `created_at` | timestamptz | `createdAt` |
| `updated_at` | timestamptz | `updatedAt` |

#### Relationships

- **Belongs to** `resumes`
- **Referenced by** `interview_sessions` (many sessions may reuse one profile)

#### Notes

- Nested arrays (`projects`, `claims_to_verify`) are JSONB because they are always read/written as a unit with the profile — normalizing them would add joins with no MVP query benefit.
- User edits update `updated_at`; downstream sessions keep the profile version they were created with (via FK), not a live join to latest profile text.

---

### 3. `job_analyses`

#### Purpose

Stores the raw job description input and the structured analysis output (`JobAnalysis` contract). Combines input and output in one entity to avoid a separate `job_descriptions` table for MVP — the JD is not reused independently of its analysis in the current flow.

#### Fields

| Field | Type (conceptual) | Maps to contract |
|-------|-------------------|------------------|
| `id` | UUID, PK | `JobAnalysis.id` |
| `user_id` | text, NOT NULL | Tenancy |
| `source_text` | text, NOT NULL | Raw pasted JD |
| `source_url` | text | Optional job posting URL (future scraping) |
| `company_name` | text, NOT NULL | `companyName` |
| `role_title` | text, NOT NULL | `roleTitle` |
| `role_summary` | text, NOT NULL | `roleSummary` |
| `required_skills` | text[] | `requiredSkills` |
| `nice_to_have_skills` | text[] | `niceToHaveSkills` |
| `seniority_level` | JSONB | `SeniorityLevel` — `{ level, confidence }` |
| `likely_interview_categories` | text[] | `likelyInterviewCategories` |
| `must_prove` | text[] | `mustProve` |
| `hidden_expectations` | JSONB | `HiddenExpectation[]` |
| `interview_signals` | text[] | `interviewSignals` |
| `suggested_question_angles` | JSONB | `SuggestedQuestionAngle[]` |
| `created_at` | timestamptz | `createdAt` |
| `updated_at` | timestamptz | `updatedAt` |

#### Relationships

- **Referenced by** `interview_sessions` (many sessions may reuse one analysis)

#### Notes

- **Rejected for MVP:** separate `job_descriptions` table. Re-analysis of the same paste is rare; a new row is cheaper than normalizing input/output.
- `company_name` and `role_title` may come from user input or AI extraction — store the canonical values used for display and report framing.

---

### 4. `interview_sessions`

#### Purpose

The persisted root of one interview run. Holds blueprint **metadata** and lifecycle state (`InterviewSession` + `InterviewBlueprint` contracts). Questions, answers, and evaluations live on child rows.

#### Fields

| Field | Type (conceptual) | Maps to contract |
|-------|-------------------|------------------|
| `id` | UUID, PK | `InterviewSession.id` **and** `interviewId` / `InterviewBlueprint.interviewId` |
| `user_id` | text, NOT NULL | Tenancy |
| `profile_id` | UUID, FK → `candidate_profiles.id`, NOT NULL | `profileId` |
| `job_analysis_id` | UUID, FK → `job_analyses.id`, NOT NULL | `jobAnalysisId` |
| `interview_title` | text, NOT NULL | `InterviewBlueprint.interviewTitle` |
| `estimated_duration_minutes` | integer, NOT NULL | `InterviewBlueprint.estimatedDurationMinutes` |
| `question_count` | integer, NOT NULL | `InterviewBlueprint.questionCount` — denormalized; must match child row count |
| `categories` | text[] | `InterviewBlueprint.categories` |
| `status` | enum, NOT NULL | `InterviewStatus`: `draft`, `ready`, `in_progress`, `completed`, `abandoned` |
| `generated_at` | timestamptz, NOT NULL | `InterviewBlueprint.generatedAt` |
| `started_at` | timestamptz | `InterviewSession.startedAt` |
| `completed_at` | timestamptz | `InterviewSession.completedAt` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

#### Relationships

- **Belongs to** `candidate_profiles`, `job_analyses`
- **Has many** `interview_questions`
- **Has one** `interview_reports` (when completed)

#### Notes

- **`draft` → `ready`:** session created after generation, before the candidate starts.
- **`in_progress`:** first question displayed; set `started_at`.
- **`completed`:** all questions answered and evaluated; report generated; set `completed_at`.
- **`abandoned`:** explicit exit or timeout (future); partial data retained.
- Provenance FKs snapshot which profile and job analysis were used — they do not auto-update if the user later edits those records.

---

### 5. `interview_questions`

#### Purpose

One row per question in an interview run. Stores the **immutable question snapshot**, the **candidate answer**, and the **evaluation result** as they are produced — matching `QuestionSessionRecord` in the data contracts.

#### Fields — question (set at generation)

| Field | Type (conceptual) | Maps to contract |
|-------|-------------------|------------------|
| `id` | UUID, PK | `InterviewQuestion.id` |
| `session_id` | UUID, FK → `interview_sessions.id`, NOT NULL | |
| `display_order` | integer, NOT NULL | `InterviewQuestion.order` (1-based) |
| `category` | text, NOT NULL | `category` |
| `difficulty` | text, NOT NULL | `difficulty` |
| `question_text` | text, NOT NULL | `question` |
| `expected_signals` | text[] | `expectedSignals` |
| `follow_up_opportunities` | text[] | `followUpOpportunities` — stored for future adaptive follow-ups; unused in MVP |

#### Fields — answer (nullable until submitted)

| Field | Type (conceptual) | Maps to contract |
|-------|-------------------|------------------|
| `answer_mode` | enum | `CandidateAnswer.answerMode`: `voice`, `text` |
| `transcript` | text | `CandidateAnswer.transcript` |
| `duration_seconds` | integer | `CandidateAnswer.durationSeconds` |
| `submitted_at` | timestamptz | `CandidateAnswer.submittedAt` |

#### Fields — evaluation (nullable until evaluated)

| Field | Type (conceptual) | Maps to contract |
|-------|-------------------|------------------|
| `score` | integer | `EvaluationResult.score` (0–100) |
| `strengths` | text[] | `strengths` |
| `weaknesses` | text[] | `weaknesses` |
| `missing_signals` | text[] | `missingSignals` |
| `confidence_level` | enum | `EvaluationResult.confidenceLevel`: `Low`, `Medium`, `High` |
| `suggested_answer` | text | `suggestedAnswer` |
| `recommended_topics` | text[] | `recommendedTopics` |
| `evaluated_at` | timestamptz | `EvaluationResult.evaluatedAt` |

#### Relationships

- **Belongs to** `interview_sessions`

#### Notes

- **Rejected for MVP:** separate `interview_answers` and `interview_evaluations` tables. The 1:1 per-question lifecycle never needs independent answer history.
- **`questionId` in contracts** maps to `interview_questions.id`. **`interviewId`** maps to `interview_sessions.id`.
- Answer columns are NULL until submit; evaluation columns are NULL until the evaluation pipeline completes.
- Reconstructing `InterviewSession.questions[]` is a ordered SELECT on `session_id`.

---

### 6. `interview_reports`

#### Purpose

Cross-interview synthesis produced after all questions are evaluated (`FinalReport` contract). One report per completed session.

#### Fields

| Field | Type (conceptual) | Maps to contract |
|-------|-------------------|------------------|
| `id` | UUID, PK | `FinalReport.id` |
| `session_id` | UUID, FK → `interview_sessions.id`, UNIQUE, NOT NULL | `interviewId` → session PK |
| `overall_score` | integer, NOT NULL | `overallScore` (0–100) |
| `readiness_level` | text, NOT NULL | `readinessLevel` |
| `confidence` | enum, NOT NULL | `confidence`: `Low`, `Medium`, `High` |
| `strength_areas` | text[] | `strengthAreas` |
| `weak_areas` | text[] | `weakAreas` |
| `risk_areas` | text[] | `riskAreas` |
| `recommended_topics` | text[] | `recommendedTopics` |
| `summary` | text, NOT NULL | `summary` |
| `coaching_recommendations` | text[] | `coachingRecommendations` |
| `study_recommendations` | text[] | `studyRecommendations` |
| `hiring_manager_summary` | text, NOT NULL | `hiringManagerSummary` |
| `generated_at` | timestamptz, NOT NULL | `generatedAt` |

#### Relationships

- **Belongs to** `interview_sessions` (1:1)

#### Notes

- Per-question score rollups for UI are **not** stored here — derive from `interview_questions.score`.
- Regenerating a report (future) would UPDATE this row or version it; MVP writes once at completion.

---

## Indexes and constraints

### Primary & foreign keys

| Table | PK | FK constraints |
|-------|----|----------------|
| `resumes` | `id` | — |
| `candidate_profiles` | `id` | `resume_id` → `resumes.id` |
| `job_analyses` | `id` | — |
| `interview_sessions` | `id` | `profile_id`, `job_analysis_id` |
| `interview_questions` | `id` | `session_id` → `interview_sessions.id` ON DELETE CASCADE |
| `interview_reports` | `id` | `session_id` → `interview_sessions.id` ON DELETE CASCADE, UNIQUE |

### Recommended indexes

| Table | Index | Purpose |
|-------|-------|---------|
| `resumes` | `(user_id, created_at DESC)` | List user's uploads |
| `candidate_profiles` | `(user_id, updated_at DESC)` | Profile picker / history |
| `candidate_profiles` | `(resume_id)` | Lookup profile for a resume |
| `job_analyses` | `(user_id, created_at DESC)` | Past job analyses |
| `interview_sessions` | `(user_id, status, updated_at DESC)` | Dashboard: in-progress vs completed |
| `interview_sessions` | `(profile_id)` | Sessions for a profile |
| `interview_sessions` | `(job_analysis_id)` | Sessions for a job analysis |
| `interview_questions` | `(session_id, display_order)` UNIQUE | Ordered question fetch; enforces one row per slot |
| `interview_reports` | `(session_id)` UNIQUE | 1:1 report lookup |

### Check constraints

| Table | Constraint |
|-------|------------|
| `resumes` | `parse_status IN ('pending', 'succeeded', 'failed')` |
| `interview_sessions` | `status IN ('draft', 'ready', 'in_progress', 'completed', 'abandoned')` |
| `interview_sessions` | `question_count >= 1` |
| `interview_questions` | `display_order >= 1` |
| `interview_questions` | `answer_mode IS NULL OR answer_mode IN ('voice', 'text')` |
| `interview_questions` | `score IS NULL OR (score >= 0 AND score <= 100)` |
| `interview_questions` | `confidence_level IS NULL OR confidence_level IN ('Low', 'Medium', 'High')` |
| `interview_reports` | `overall_score >= 0 AND overall_score <= 100` |
| `interview_reports` | `confidence IN ('Low', 'Medium', 'High')` |

### Referential integrity notes

- **`ON DELETE CASCADE`** from `interview_sessions` → questions and report: deleting a session removes its run data.
- **`ON DELETE RESTRICT`** (recommended) from `interview_sessions` → `candidate_profiles` / `job_analyses`: prevent deleting inputs that sessions depend on. Soft-delete profiles in a future phase if needed.
- **`user_id` consistency:** application layer must verify `profile.user_id = session.user_id = resume.user_id` on create — not enforced by a single FK chain.

---

## Rejected tables (and why)

| Proposed table | Verdict | Reason |
|----------------|---------|--------|
| `job_descriptions` | Reject | Input text fits on `job_analyses.source_text`; no independent lifecycle in MVP |
| `interview_blueprints` | Reject | Metadata on session + questions replaces the blueprint document |
| `interview_answers` | Reject | 1:1 with question; columns on `interview_questions` |
| `interview_evaluations` | Reject | Same |
| `project_experience`, `resume_claims`, etc. | Reject | JSONB arrays on profile; never queried independently |
| `interview_categories` | Reject | Free-text `category` on questions; no shared taxonomy yet |
| `ai_generation_logs` | Defer | Observability belongs in logging/tracing, not product schema |
| `voice_recordings` | Defer | Blob storage concern; transcript on question row is sufficient for MVP |
| `users` | Reject | Clerk is system of record; `user_id` text matches existing practice tables |

---

## Contract-to-table mapping

| Data contract | Persistence |
|---------------|-------------|
| `CandidateProfile` | `candidate_profiles` |
| `JobAnalysis` | `job_analyses` |
| `InterviewBlueprint` | `interview_sessions` (metadata) + `interview_questions` (questions) |
| `InterviewQuestion` | `interview_questions` (question columns) |
| `CandidateAnswer` | `interview_questions` (answer columns) |
| `EvaluationResult` | `interview_questions` (evaluation columns) |
| `InterviewSession` | `interview_sessions` + joined `interview_questions` |
| `FinalReport` | `interview_reports` |

---

## Access patterns (MVP)

| Operation | Path |
|-----------|------|
| Create profile from resume | INSERT `resumes` → parse → INSERT `candidate_profiles` |
| Create job analysis | INSERT `job_analyses` |
| Generate interview | INSERT `interview_sessions` + bulk INSERT `interview_questions` |
| Resume in-progress session | SELECT session + questions ORDER BY `display_order`; filter by `user_id` + `status = in_progress` |
| Submit answer | UPDATE question row (answer columns) |
| Store evaluation | UPDATE question row (evaluation columns) |
| Complete & report | UPDATE session status; INSERT `interview_reports` |
| Load final report screen | SELECT report + session + questions (for per-question UI rollup) |
| List user history | SELECT sessions WHERE `user_id` ORDER BY `updated_at` |

---

## Proposed ERD

```mermaid
erDiagram
    RESUMES ||--o{ CANDIDATE_PROFILES : "source"
    CANDIDATE_PROFILES ||--o{ INTERVIEW_SESSIONS : "used by"
    JOB_ANALYSES ||--o{ INTERVIEW_SESSIONS : "used by"
    INTERVIEW_SESSIONS ||--|{ INTERVIEW_QUESTIONS : "contains"
    INTERVIEW_SESSIONS ||--o| INTERVIEW_REPORTS : "produces"

    RESUMES {
        uuid id PK
        text user_id
        text file_name
        text storage_key
        text extracted_text
        enum parse_status
    }

    CANDIDATE_PROFILES {
        uuid id PK
        text user_id
        uuid resume_id FK
        text summary
        text_array core_skills
        jsonb projects
        jsonb claims_to_verify
        text_array strength_areas
        text_array potential_gap_areas
    }

    JOB_ANALYSES {
        uuid id PK
        text user_id
        text source_text
        text company_name
        text role_title
        text role_summary
        text_array required_skills
        jsonb seniority_level
        jsonb hidden_expectations
    }

    INTERVIEW_SESSIONS {
        uuid id PK
        text user_id
        uuid profile_id FK
        uuid job_analysis_id FK
        text interview_title
        int question_count
        text_array categories
        enum status
        timestamptz generated_at
        timestamptz started_at
        timestamptz completed_at
    }

    INTERVIEW_QUESTIONS {
        uuid id PK
        uuid session_id FK
        int display_order
        text category
        text question_text
        text_array expected_signals
        enum answer_mode
        text transcript
        int score
        text_array missing_signals
        enum confidence_level
    }

    INTERVIEW_REPORTS {
        uuid id PK
        uuid session_id FK UK
        int overall_score
        text readiness_level
        enum confidence
        text summary
        text hiring_manager_summary
    }
```

---

## Potential future entities

| Entity | Trigger to add |
|--------|----------------|
| `profile_versions` | User edits profile after sessions exist; need immutable snapshots beyond FK |
| `job_descriptions` | Job URL scraping, re-analysis without re-paste, shared JD library |
| `interview_evaluations` (split) | Re-run evaluation with new rubric without touching answer |
| `voice_recordings` | Playback, compliance retention, re-transcription |
| `study_plans` | Automated multi-day plans from report recommendations |
| `session_comparisons` | Cross-interview progress tracking |
| `follow_up_questions` | Adaptive interview mode using `follow_up_opportunities` |
| `ai_usage_events` | Cost attribution per user/session |
| `shared_reports` | Public or hiring-manager share links |

---

## Recommended MVP schema

**Six tables.** This is the smallest schema that fully supports resume upload, profile storage, job analysis, interview generation, question playback, answers, per-question evaluation, and final reports.

| # | Table | Role |
|---|-------|------|
| 1 | `resumes` | Upload metadata, storage reference, extracted text |
| 2 | `candidate_profiles` | Structured, editable candidate context |
| 3 | `job_analyses` | Raw JD + structured job intelligence |
| 4 | `interview_sessions` | Interview run root, blueprint metadata, lifecycle |
| 5 | `interview_questions` | Question snapshot + answer + evaluation per row |
| 6 | `interview_reports` | Final synthesized report (1:1 with session) |

**Identity simplification:** Use `interview_sessions.id` as the single `interviewId` everywhere in APIs and contracts for MVP. No separate session vs interview ID unless retry/regeneration is added later.

**Storage split:** Postgres for structured data and transcripts; object storage for resume files; no audio in Postgres for MVP.

**Tenancy:** Every user-owned row includes `user_id`; all reads and writes scoped by Clerk subject in the application layer.

---

## Related documents

- [Data contracts](./data-contracts.md)
- [AI flow](./ai-flow.md)
- [Feature spec: Profile System](../feature-specs/01-profile-system.md)
- [Feature spec: Job Analysis](../feature-specs/02-job-analysis.md)
- [Feature spec: Interview Generation](../feature-specs/03-interview-generation.md)
- [Feature spec: Question Player](../feature-specs/04-question-player.md)
- [Feature spec: Answer Evaluation](../feature-specs/05-answer-evaluation.md)
- [Feature spec: Final Report](../feature-specs/06-final-report.md)
