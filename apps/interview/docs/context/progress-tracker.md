# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Job Analysis vertical slice **complete** (P0–P3)

## Current Goal

- Interview Generator (next system slice)

## In Progress

- (none)

## Session Notes

- **Job Analysis shipped:** DB `interview_job_analyses`, Nest API, `/job-analysis` UI — branches `feature/interview-job-analysis` / `-P2` / `-P3`.
- **P3 complete:** `/job-analysis` page, workspace UI, server actions, nav + Clerk protect.
- **P2 complete:** Nest `interview-job-analysis` module — generate, save, GET me/id; `api-contracts.md` updated.
- **P1 complete:** `interview_job_analyses` in `schema.ts`, migration `0006` applied on Neon.
- **P0 complete:** decisions locked, doc alignment, migrate + typecheck verified.
- Initial scaffold: Next zone app at `apps/interview`, port 3012.
- Link from `apps/app` landing header via `NEXT_PUBLIC_INTERVIEW_URL`.

## Completed

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

- Interview Generator (`interview_sessions` + blueprint)
- Wire Screen 1 create flow to saved profile + job analysis ids
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

- **Zone app** at `apps/interview` (not nested under `apps/app`)
- **Prototype-first** — `/interview` mock flow public; `/profile` and `/job-analysis` authenticated
- **Job Analysis table** — physical `interview_job_analyses`; logical `job_analyses` in architecture docs
- **Job Analysis API** — `/interview/job-analyses`; contract from data-contracts §2
- **Job Analysis company/role** — AI extract on generate; optional UI override before save
- **Job Analysis UI** — `/job-analysis` workspace (Option A)
- **Job Analysis history** — latest-only via `GET .../me`
