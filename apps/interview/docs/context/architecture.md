# Architecture Context

## Environments

| Environment | Interview zone (`apps/interview`) | Host (`apps/app`) |
| ----------- | --------------------------------- | ----------------- |
| Local dev   | `http://localhost:3012` (`/` landing, `/interview` flow) | `http://localhost:3010` |
| Production  | TBD — subdomain or path rewrite on host | CodeDrill primary |

## Stack (current / planned)

| Layer | Technology | Role |
| ----- | ---------- | ---- |
| Framework | Next.js 16 + TypeScript | Zone app UI |
| UI | Tailwind 4 + `@repo/design-system` | Shared shadcn primitives |
| Auth | Clerk (`@clerk/nextjs`) | Same Clerk app as `apps/app`; sign in on `:3012` for interview origin |
| Database | Postgres via Drizzle (planned) | Sessions, answers, feedback |
| AI | TBD | Resume/JD analysis, question gen, evaluation |

## System Boundaries

- `apps/interview/app/` — App Router routes (thin)
- `apps/interview/features/` — Domain UI and future hooks
- `apps/interview/docs/` — Spec pack and PRD
- `apps/app/` — Host app; nav link to interview zone
- `apps/api` / new services — Future API for persistence and AI (not chosen yet)

## Routing

- **`/`** — landing page
- **`/interview`** — prototype flow (`InterviewCoach`)
- **Host integration:** Not configured yet on `apps/app` — dev uses separate port (`3012`)
- **Cross-app links:** Plain `<a>` from CodeDrill with `NEXT_PUBLIC_INTERVIEW_URL`

## Invariants

1. This product is a **guided interview coach**, not a conversational chatbot (see PRD).
2. Persistence and AI require explicit spec authorization; Clerk is wired for profile slice work.
3. UI primitives come from `@repo/design-system`, not copied into this app.

## Future integration

- **Clerk:** Same application as `apps/app`; `lib/auth/api-auth-headers.ts` → `apps/api` Bearer JWT
- **Multi-zone:** Single-origin session after host rewrites — not required for dev
- **Identity API:** `nest-clerk-api` only if interview needs Neon user rows beyond `apps/api`
- **Data:** New tables or service owned explicitly in a feature spec before implementation
