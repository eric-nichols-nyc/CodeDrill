# AI Interview Coach — agent context

Instructions for AI agents working in **`apps/interview`** (Next.js zone app). Read this file first, then the context files below before implementing product behavior.

## Read order

1. **[prd.md](./prd.md)** — product requirements and MVP scope (source of truth).
2. **[context/project-overview.md](./context/project-overview.md)** — goals and core flow summary.
3. **[context/architecture.md](./context/architecture.md)** — stack, boundaries, multi-zone setup.
4. **[context/progress-tracker.md](./context/progress-tracker.md)** — current phase, done / next / open questions.

Follow **[context/ai-workflow-rules.md](./context/ai-workflow-rules.md)** for scoping and doc updates.

**Greenfield or new major system:** follow the phase order in **[planning-checklist.md](./planning-checklist.md)** (do not read every session).

## Scope

| Area | Path | Role |
|------|------|------|
| **This app** | `apps/interview` | Interview UI (`/` landing, `/interview` prototype flow) |
| **Host app** | `apps/app` | CodeDrill main app; links here via `NEXT_PUBLIC_INTERVIEW_URL` |
| **Design system** | `packages/design-system` | shadcn/ui primitives — do not fork under `apps/interview` |

**Current phase:** Static UI prototype only. No Clerk, API, DB, or AI until specs say otherwise.

### Monorepo scope

- Default in-scope with `apps/app`, `apps/api`, and `packages/design-system` — see repo-root [`AGENTS.md`](../../../AGENTS.md).
- Do not search or edit other `apps/*` unless the user expands scope.

## Commands (`apps/interview`)

```sh
pnpm dev          # http://localhost:3012
pnpm build
pnpm typecheck
```

From repo root, run app + host together:

```sh
pnpm dev:interview
```

## Implementation defaults

- **Spec-driven:** Do not invent behavior missing from `prd.md`. Ambiguity → note in `context/progress-tracker.md`.
- **UI:** `@repo/design-system/components/ui/*`; colocate features under `apps/interview/features/<area>/`.
- **Next.js:** Prefer Server Components; add `"use client"` only for browser APIs and interactivity.
- **Cross-app links:** From `apps/app`, link to this app with plain `<a href="...">` and `NEXT_PUBLIC_INTERVIEW_URL` (separate origin in dev).
- **Routes:** Keep `app/` routes thin; page composition in `features/`.

## Protected (unless explicitly asked)

- `packages/design-system/components/ui/**` — add via `npx shadcn@latest add … -c packages/design-system`
- Auth, persistence, and AI pipelines — not in scope until documented in context files

## Progress tracker

After meaningful work, update **[context/progress-tracker.md](./context/progress-tracker.md)** unless the user excludes doc updates.

## Quick map

```
apps/interview/
  app/              # App Router (static prototype routes)
  features/         # Domain UI (shell, create, session, …)
  docs/
    AGENTS.md              # This file
    planning-checklist.md  # Planning pipeline + doc map
    prd.md                 # Product requirements
    feature-specs/         # Per-system specs
    architecture/          # Overview, AI flow, contracts, DB, API (planned)
    context/               # Overview, stack, tracker, workflow rules
  AGENTS.md         # Cursor stub → points here
```
