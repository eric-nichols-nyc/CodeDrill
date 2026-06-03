# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Static UI prototype (branch `interview-app`)

## Current Goal

- Profile vertical slice: resume text → AI → `interview_*` tables → review UI on `/profile`

## In Progress

- Clerk wired in `apps/interview` (same app as host; `/profile` protected)

## Session Notes

- Initial scaffold: Next zone app at `apps/interview`, `basePath: /interview`, port 3012.
- Five static prototype routes matching PRD screens; PRD and conservative agent docs added.
- Link from `apps/app` landing header via `NEXT_PUBLIC_INTERVIEW_URL`.

## Completed

- interview auth — Clerk in `apps/interview` (`ClerkProvider`, `proxy.ts`, `/sign-in`, `apiAuthHeaders`, `/profile` stub)
- interview zone — app scaffold, design-system shell, static landing + 5 MVP screens
- interview docs — `prd.md`, `AGENTS.md`, context overview / architecture / workflow rules
- interview docs — `planning-checklist.md`, expanded `docs/README.md`, `architecture/api-contracts.md` stub (step 8)
- monorepo — `apps/interview` added to agent scope; `pnpm dev:interview` script

## Next Up

- Multi-zone rewrites on `apps/app` (single origin `/interview`)
- Flesh out Screen 1 form UI (resume upload, JD textarea, difficulty)
- Resolve PRD open questions via prototype review
- Drizzle `interview_resumes` + `interview_candidate_profiles` + Nest endpoints
- API action contracts for profile generate/save/get
- Multi-zone rewrites on `apps/app` (single origin `/interview`)

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
