# Architecture Overview

Entry point for engineers joining the **AI Interview Coach** project (`apps/interview`). This document summarizes the system as documented today — product intent, major systems, data and AI flows, principles, and MVP boundaries.

For deeper detail, follow the links at the end. Do not infer behavior beyond these documents.

---

## Product purpose

AI Interview Coach helps engineers prepare for interviews with **personalized mock sessions** built from a resume and a target job description. Users practice **speaking answers aloud**, receive **per-question feedback**, and finish with a **final report**.

This is a **guided interview coach**, not a free-form chatbot. The product simulates a structured interview: fixed questions, voice-first practice, evidence-based evaluation, and actionable coaching — not open-ended conversation.

**Goals:**

1. Generate a tailored interview plan in under two minutes.
2. Simulate realistic, role-specific questions tied to the candidate's experience.
3. Coach through voice practice with actionable feedback and study recommendations.

---

## Current implementation state

**Phase: static UI prototype** (branch `interview-app`).

What exists today:

| Layer | Status |
|-------|--------|
| Next.js zone app (`apps/interview`) | Live — landing at `/`, prototype flow at `/interview` |
| Five MVP screens | Static pages with mock data |
| Host integration | Link from `apps/app` via `NEXT_PUBLIC_INTERVIEW_URL` (separate origin in dev) |
| Clerk auth | Not wired |
| Database / API | Not implemented — schema designed, not migrated |
| AI pipelines | Specified — not implemented |
| Voice recording / transcription | Mocked in UI |

Local dev: `http://localhost:3012` (`pnpm dev` from `apps/interview`). Host app: `http://localhost:3010`.

The sections below describe the **target architecture** as defined in feature specs and architecture docs. Implementation will follow once the static flow is validated.

---

## Core user journey

```txt
1. Upload resume        → Profile System extracts structured candidate profile
2. Paste job description → Job Analysis System extracts role intelligence
3. Generate interview   → Interview Generator produces 5–10 targeted questions
4. Answer by voice      → Question Player captures transcript → Answer Evaluation per question
5. Review final report  → Final Report System aggregates patterns and recommendations
```

**Prototype screen flow** (static, single route):

| Step | Screen | Route |
|------|--------|-------|
| Landing | Marketing / entry | `/` |
| Create | Resume upload, JD paste, difficulty | `/interview` |
| Overview | Interview blueprint preview | `/interview` |
| Question | One question at a time, answer capture | `/interview` |
| Feedback | Per-question score and coaching | `/interview` |
| Report | Final summary and recommendations | `/interview` |

Open product questions (from progress tracker): feedback timing, transcript visibility, retry/skip behavior, follow-up questions, timed interviews.

---

## System context

```txt
┌─────────────────────────────────────────────────────────────────┐
│                        CodeDrill monorepo                        │
├─────────────────────────────────────────────────────────────────┤
│  apps/app (host)          apps/interview (this product)         │
│  localhost:3010           localhost:3012, basePath /interview   │
│  Links via NEXT_PUBLIC_INTERVIEW_URL                            │
├─────────────────────────────────────────────────────────────────┤
│  apps/api (planned)       packages/design-system                │
│  NestJS + Postgres        Shared shadcn/ui primitives           │
│  Interview tables (planned, additive to practice DB)            │
├─────────────────────────────────────────────────────────────────┤
│  Clerk (planned)          AI provider (TBD)                     │
│  Shared auth with host    Structured JSON outputs per pipeline  │
└─────────────────────────────────────────────────────────────────┘
```

| Component | Path | Role |
|-----------|------|------|
| Interview zone | `apps/interview` | UI — landing, interview flow, future client hooks |
| Host app | `apps/app` | CodeDrill primary app; navigation to interview zone |
| API | `apps/api` | Planned persistence layer (Postgres via Drizzle) |
| Design system | `packages/design-system` | UI primitives — do not fork under `apps/interview` |

**Routing conventions:**

- `apps/interview/app/` — thin App Router routes
- `apps/interview/features/` — domain UI and future hooks
- Cross-app links use plain `<a href="...">`, not shared Next.js router

**Planned production:** single origin via multi-zone rewrites on `apps/app` (not configured yet).

---

## Major systems

Six bounded systems compose the interview pipeline. Each has a single responsibility and communicates through typed data contracts.

| System | Purpose | Creates | Consumes |
|--------|---------|---------|----------|
| **Profile System** | Convert resume → structured candidate context | `CandidateProfile` | Resume text |
| **Job Analysis System** | Convert job description → hiring intelligence | `JobAnalysis` | Job description, optional URL, company, role title |
| **Interview Generator** | Plan what evidence to collect | `InterviewBlueprint` + `InterviewQuestion[]` | `CandidateProfile`, `JobAnalysis` |
| **Question Player** | Guided interview UX — one question at a time | `CandidateAnswer`, `InterviewSession` | `InterviewBlueprint`, questions |
| **Answer Evaluation** | Assess one answer against expected signals | `EvaluationResult` | Question, expected signals, transcript |
| **Final Report** | Cross-interview pattern analysis | `FinalReport` | `InterviewSession`, all evaluation results |

### Profile System

Extracts structured interview context from a resume — not just storage, but understanding sufficient to generate resume-specific questions.

**Output highlights:** candidate summary, core skills, project experience with verifiable claims, claims to verify (with question angles), strength areas, potential gap areas.

**MVP:** upload resume → extract text → generate profile → save → allow review/edit.

### Job Analysis System

Thinks like a hiring manager: *"What would a strong candidate need to demonstrate to get hired for this role?"*

**Output highlights:** role summary, required/nice-to-have skills, seniority level, likely interview categories, what the candidate must prove, hidden expectations, interview signals, suggested question angles.

**Does not:** generate questions, score candidates, compare against resume, or produce feedback.

### Interview Generator

Determines *what evidence must be collected* to evaluate role fit. Creates the interview plan — not evaluations or reports.

**Output highlights:** interview blueprint (title, duration, 5–10 questions), categories, question order (easier → harder), expected signals per question, follow-up opportunities (stored, not acted on in MVP).

### Question Player

Controls the interview experience. Slideshow-style — one question at a time, voice-first (typed fallback).

**States:** `idle` → `recording` → `transcribing` → `ready_to_submit` → `submitting` → `feedback_ready` → `completed`.

**Does not:** generate questions, evaluate answers, or produce final reports.

### Answer Evaluation System

Evaluates one answer at a time. Goal is evidence collection, not correctness alone: *"Did this answer provide sufficient evidence that the candidate satisfies role expectations?"*

**Criteria:** technical accuracy, completeness (expected signals), depth, communication, evidence of role fit.

**Output:** score (0–100), strengths, weaknesses, missing signals, confidence level, suggested answer, recommended topics.

### Final Report System

Aggregates all per-question evaluations. Identifies strength/weakness patterns, risk areas, role readiness, coaching and study recommendations, and a hiring-manager summary.

**Does not:** evaluate individual answers (upstream) or rewrite resumes, apply for jobs, or track long-term progress.

---

## System responsibilities

Each system owns one job. Boundaries are strict:

```txt
Profile System          → Who is the candidate?
Job Analysis System     → What does the company need?
Interview Generator     → What evidence should we collect?
Question Player         → How does the candidate experience the interview?
Answer Evaluation       → Did the candidate provide sufficient evidence?
Final Report System     → What patterns emerged and what should they do next?
```

**Cross-cutting rules:**

- Systems communicate via **data contracts** ([data-contracts.md](./data-contracts.md)), not shared internal logic.
- AI calls return **structured JSON** — one responsibility per call.
- The Question Player is **not a chatbot**; it is a guided, linear interview.
- UI primitives come from `@repo/design-system` — not copied into `apps/interview`.
- Auth and persistence require explicit spec authorization before implementation.

---

## Data flow

End-to-end pipeline from inputs to final output:

```txt
Resume                          Job Description
   ↓                                   ↓
Profile System                  Job Analysis System
   ↓                                   ↓
CandidateProfile                JobAnalysis
         ↘                       ↙
          Interview Generator
                   ↓
          InterviewBlueprint (InterviewQuestion[])
                   ↓
          Question Player ──→ CandidateAnswer
                   ↓
          Answer Evaluation ──→ EvaluationResult
                   ↓
          InterviewSession (runtime aggregate)
                   ↓
          Final Report System ──→ FinalReport
```

### Key contracts

| Contract | Scale / notes |
|----------|---------------|
| `CandidateProfile` | Skills, projects, claims, strength/gap areas |
| `JobAnalysis` | Role intelligence, must-prove list, hidden expectations |
| `InterviewBlueprint` | Metadata + ordered questions with expected signals |
| `CandidateAnswer` | Transcript, answer mode (`voice` \| `text`), timing |
| `EvaluationResult` | Score 0–100, strengths, weaknesses, missing signals, confidence |
| `InterviewSession` | Join of blueprint + answers + evaluations + lifecycle status |
| `FinalReport` | Aggregate score, patterns, recommendations, hiring-manager summary |

Scores use a **0–100 integer scale** throughout. Identifiers (`id`, `interviewId`, `questionId`) are required once data crosses system boundaries or enters persistence.

See [data-contracts.md](./data-contracts.md) for full TypeScript shapes, examples, and the contract dependency matrix.

### Persistence (planned)

Interview data will live in the **existing CodeDrill Postgres database** (`apps/api`), additive to practice tables:

```txt
User (Clerk)
  ├── resumes
  │     └── candidate_profiles
  ├── job_analyses
  └── interview_sessions
        ├── interview_questions  (question + answer + evaluation per row)
        └── interview_reports    (1:1 with completed session)
```

**Transient (not stored):** raw voice audio, LLM streaming tokens, in-progress draft answers, prompt payloads, UI derivations (letter grades).

See [database.md](./database.md) for entity definitions, indexes, and access patterns.

---

## AI flow

Five discrete AI calls — one question answered per call. No monolithic "do everything" prompts.

| Flow | Input | Task | Output |
|------|-------|------|--------|
| **1. Profile generation** | `resumeText` | Analyze resume → structured profile | `CandidateProfile` |
| **2. Job analysis** | `jobDescription` (+ metadata) | Identify skills, seniority, expectations, must-prove | `JobAnalysis` |
| **3. Interview generation** | `candidateProfile`, `jobAnalysis` | Generate blueprint with 5–10 questions and expected signals | `InterviewBlueprint` |
| **4. Answer evaluation** | `question`, `expectedSignals`, `candidateAnswer` | Assess evidence against signals | `EvaluationResult` |
| **5. Final report** | `interview`, `evaluationResults[]` | Identify cross-question patterns | `FinalReport` |

```txt
Every AI call should answer one question:

  Profile System        → Who is the candidate?
  Job Analysis          → What does the company need?
  Interview Generator   → What evidence should we collect?
  Answer Evaluation     → Did the candidate provide sufficient evidence?
  Final Report          → What patterns emerged and what should they do next?
```

**AI design principles:**

- **Structured outputs** — JSON contracts, not free-form text where possible.
- **Single responsibility** — one job per AI call.
- **Predictable contracts** — consumers know what they receive and return without knowing prompt internals.

Provider, model selection, streaming UX, and observability are **TBD**. See [feature-specs/07-ai-flow.md](../feature-specs/07-ai-flow.md).

---

## Architectural principles

### Product

1. **Guided coach, not chatbot** — fixed question flow, voice practice, structured feedback.
2. **Evidence-based evaluation** — assess whether answers demonstrate role-fit signals, not just technical correctness.
3. **Resume + JD personalization** — questions target resume claims, job requirements, and hidden expectations.
4. **Spec-driven development** — behavior comes from feature specs and data contracts; ambiguity goes to the progress tracker.

### Engineering

1. **Zone app isolation** — `apps/interview` is a separate Next.js app, not nested under `apps/app`.
2. **Thin routes, fat features** — `app/` routes delegate to `features/<area>/`.
3. **Server Components first** — add `"use client"` only for browser APIs and interactivity.
4. **Shared design system** — `@repo/design-system/components/ui/*`; add via shadcn CLI, do not fork.
5. **Contract-first data** — design APIs, validators, and AI outputs against [data-contracts.md](./data-contracts.md).
6. **Immutable question snapshots** — generated questions are fixed at creation time; answers and evaluations append once per question (MVP).
7. **Prototype-first** — validate static UI flow before wiring auth, DB, or AI.

### Database (planned)

1. Map to contracts, not every nested interface — nested shapes stored as JSONB on parent rows.
2. One row per question lifecycle — question, answer, and evaluation columns on `interview_questions`.
3. No separate blueprint table — metadata on session, questions on child rows.
4. Reuse Clerk `user_id` tenancy pattern from existing practice tables.

---

## MVP boundaries

### In scope

| Area | MVP behavior |
|------|--------------|
| Profile | Upload resume, extract text, generate structured profile, save, review/edit |
| Job analysis | Accept JD, extract skills, seniority, categories, hidden expectations, question angles |
| Interview generation | 5–10 questions with expected signals, ordered by difficulty |
| Question player | One question at a time, voice or typed input, transcript review, per-question feedback, next/skip/retry/end |
| Answer evaluation | Per-question signal comparison, score, strengths/weaknesses, coaching feedback |
| Final report | Aggregate patterns, readiness estimate, coaching and study recommendations |
| Persistence | Six tables in shared Postgres (designed, not yet implemented) |
| UI prototype | Five static screens validating flow and copy |

### Out of scope (MVP)

| Area | Deferred to future |
|------|-------------------|
| Clerk auth | Shared with `apps/app` — planned, not wired |
| Real voice recording / transcription | Mocked first |
| LLM evaluation | Specified, not implemented |
| Job URL scraping | Optional URL field only |
| Adaptive follow-up questions | `followUpOpportunities` stored but unused |
| Real-time conversational interview | Slideshow-style only |
| Multi-interviewer support | — |
| Profile/job context in evaluation | Strict signal-based evaluation only |
| Multi-interview comparison | — |
| Long-term progress tracking | — |
| Automated study plans | Report text recommendations only |
| Resume rewriting / job application | — |
| Letter grades on report | UI derivation, not in contract |
| AI generation logs in DB | Observability via logging/tracing |
| Voice recording blobs in DB | Transcript only; blob storage deferred |

### Current phase exclusions

Until specs authorize: no Clerk, no Drizzle migrations, no AI SDK, no API endpoints, no multi-zone rewrites on the host.

---

## Related documents

| Document | Contents |
|----------|----------|
| [planning-checklist.md](../planning-checklist.md) | Planning pipeline and doc creation order |
| [prd.md](../prd.md) | Product requirements (stub — expand as needed) |
| [context/project-overview.md](../context/project-overview.md) | Goals and flow summary |
| [context/architecture.md](../context/architecture.md) | Stack, boundaries, routing, invariants |
| [context/progress-tracker.md](../context/progress-tracker.md) | Current phase, completed work, open questions |
| [data-contracts.md](./data-contracts.md) | TypeScript contracts, dependency matrix, MVP exclusions |
| [database.md](./database.md) | Postgres schema design, ERD, access patterns |
| [api-contracts.md](./api-contracts.md) | API/actions (planned — step 8) |
| [ai-flow.md](./ai-flow.md) | Intelligent steps — inputs, outputs, consumers |
| [feature-specs/01-profile-system.md](../feature-specs/01-profile-system.md) | Profile System spec |
| [feature-specs/02-job-analysis.md](../feature-specs/02-job-analysis.md) | Job Analysis spec |
| [feature-specs/03-interview-generation.md](../feature-specs/03-interview-generation.md) | Interview Generator spec |
| [feature-specs/04-question-player.md](../feature-specs/04-question-player.md) | Question Player spec |
| [feature-specs/05-answer-evaluation.md](../feature-specs/05-answer-evaluation.md) | Answer Evaluation spec |
| [feature-specs/06-final-report.md](../feature-specs/06-final-report.md) | Final Report spec |
| [feature-specs/07-ai-flow.md](../feature-specs/07-ai-flow.md) | AI call inputs, outputs, principles |

**Suggested read order for new engineers:**

0. [planning-checklist.md](../planning-checklist.md) — how the doc set fits together
1. This document
2. [context/project-overview.md](../context/project-overview.md)
3. Feature specs 01–06 (pipeline order)
4. [data-contracts.md](./data-contracts.md)
5. [database.md](./database.md) when working on persistence
6. [context/progress-tracker.md](../context/progress-tracker.md) for current sprint state
