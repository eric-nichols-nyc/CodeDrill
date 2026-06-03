# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Job Analysis — Phase 3 (Interview app UI)

## Current Goal

- `/job-analysis` workspace: types, server actions, generate → preview → save → reload

## In Progress

- Branch `feature/interview-job-analysis` — [03-job-analysis-implementation.md](../implementation/03-job-analysis-implementation.md)

## Session Notes

- **P2 complete:** Nest `interview-job-analysis` module — generate, save, GET me/id; `api-contracts.md` updated.
- **P1 complete:** `interview_job_analyses` in `schema.ts`, migration `0006` applied on Neon.
- **P0 complete:** `pnpm db:migrate` in `apps/api` succeeded (Neon); profile tables `0005` applied. Doc drift fixed: `07-ai-flow` Flow 2 aligned to data-contracts §2; `database.md` physical `interview_*` mapping table added.
- Initial scaffold: Next zone app at `apps/interview`, `basePath: /interview`, port 3012.
- Five static prototype routes matching PRD screens; PRD and conservative agent docs added.
- Link from `apps/app` landing header via `NEXT_PUBLIC_INTERVIEW_URL`.

## Completed

- job analysis P2 — `interview/job-analyses/*` API (generate, save, GET me, GET by id)
- job analysis P1 — `interview_job_analyses` Drizzle + migration `0006`
- job analysis P0 — decisions locked, doc alignment, migrate + typecheck verified on branch
- interview profile slice — `interview_resumes` + `interview_candidate_profiles` migration `0005`, Nest `interview/profiles/*`, `/profile` workspace UI
- interview auth — Clerk in `apps/interview` (`ClerkProvider`, `proxy.ts`, `/sign-in`, `apiAuthHeaders`)
- interview zone — app scaffold, design-system shell, static landing + 5 MVP screens
- interview docs — `prd.md`, `AGENTS.md`, context overview / architecture / workflow rules
- interview docs — `planning-checklist.md`, expanded `docs/README.md`, `architecture/api-contracts.md` stub (step 8)
- interview docs — [03-job-analysis-implementation.md](../implementation/03-job-analysis-implementation.md), [02-job-analysis.md](../feature-specs/02-job-analysis.md) acceptance criteria
- monorepo — `apps/interview` added to agent scope; `pnpm dev:interview` script

## Next Up

- Phase 3 — `/job-analysis` UI + server actions
- Manual Profile E2E in browser (paste → generate → save → reload on `/profile`) if not yet signed off
- Multi-zone rewrites on `apps/app` (single origin `/interview`)
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

- **Zone app** at `apps/interview` with `basePath: /interview` (not nested under `apps/app`)
- **Prototype-first** — `/interview` mock flow stays public; `/profile` is the authenticated slice entry
- **Job Analysis table** — physical `interview_job_analyses`; logical `job_analyses` in architecture docs
- **Job Analysis API** — `/interview/job-analyses` (generate, save, GET me, GET by id); contract from data-contracts §2
- **Job Analysis company/role** — AI extract on generate; optional UI override before save; NOT NULL on save
- **Job Analysis UI (MVP)** — dedicated `/job-analysis` workspace (Option A); Screen 1 JD wiring later
- **Job Analysis history** — latest-only via `GET .../me`; no list endpoint in MVP
