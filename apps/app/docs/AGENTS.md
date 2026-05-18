# CodeDrill app — agent context

Instructions for AI agents working in **`apps/app`** (Next.js UI). The spec pack lives in **`docs/context/`** — read this file first, then those files before implementing product behavior.

## Read order

1. **[context/project-overview.md](./context/project-overview.md)** — product goals, users, core flows (fill in as scope is defined).
2. **[context/architecture.md](./context/architecture.md)** — stack, folder boundaries, auth, storage, invariants.
3. **[context/ui-context.md](./context/ui-context.md)** — `@repo/design-system`, tokens, layout patterns.
4. **[context/code-standards.md](./context/code-standards.md)** — TypeScript, Next.js, styling, API conventions.
5. **[context/progress-tracker.md](./context/progress-tracker.md)** — current phase, done / next / open questions.
6. **[context/features-spec/00-index.md](./context/features-spec/00-index.md)** — per-feature specs; read the spec for any feature you touch.

Always follow **[context/ai-workflow-rules.md](./context/ai-workflow-rules.md)** for scoping, protected files, and keeping docs in sync.

**Product source of truth (living):** [`prd.md`](./prd.md) — use when context files are still placeholders or conflict with shipped behavior.

## Scope

| Area | Path | Role |
|------|------|------|
| **This app** | `apps/app` | Marketing, problems list, problem workspace (Monaco, Run), admin UI, docs |
| **Practice API** | `apps/api` | NestJS catalog, auth (Better Auth), Drizzle/Postgres, chat endpoints |
| **Design system** | `packages/design-system` | shadcn/ui primitives — add via CLI, do not fork under `apps/app` |

Default assumption: UI changes stay in `apps/app`; data and judging logic often belong in `apps/api`. Do not change the API unless the task requires it.

## Commands (`apps/app`)

```sh
pnpm dev          # http://localhost:3010
pnpm build
pnpm typecheck
pnpm test
pnpm test:e2e
```

API for problem fetches defaults to `NEON_JWT_API_URL` → `http://localhost:3030` (see `lib/problems/`).

## Implementation defaults

- **Spec-driven:** Do not invent product behavior missing from context files or `prd.md`. Ambiguity → note in `context/progress-tracker.md` before coding.
- **UI:** Import from `@repo/design-system/components/ui/*`; use semantic tokens per `context/ui-context.md` (no random hex in features).
- **Next.js:** Prefer Server Components; add `"use client"` only for browser APIs and interactivity.
- **Features:** Colocate under `apps/app/features/<area>/` with `components/`, `hooks/`, and `utils/` — see **[context/features-spec/01-design-system.md](./context/features-spec/01-design-system.md)** (SOLID, design tokens). **Add or update `context/features-spec/NN-<name>.md` and [00-index.md](./context/features-spec/00-index.md) when introducing a feature.**
- **Routes:** Stay thin in `apps/app/app/`.
- **Run vs Submit:** Run = in-browser sample tests today; Submit = not fully wired — see `prd.md` § current state.

## Protected (unless explicitly asked)

- `packages/design-system/components/ui/**` — change only via `npx shadcn@latest add … -c packages/design-system` or `pnpm bump-ui` from repo root
- Generated / vendor internals
- Unrelated apps in the monorepo

## Progress tracker (required)

After **every meaningful implementation change** (feature slice, bug fix with scope, or end of session), update **[context/progress-tracker.md](./context/progress-tracker.md)** before considering the task done. Do not skip this unless the user explicitly says docs are out of scope.

When updating:

- Move finished work from **In Progress** → **Completed** (one line per unit: `area — what shipped`).
- Set **Current Goal** to the next single unit, or clear it if nothing is active.
- Adjust **Next Up**, **Open Questions**, and **Architecture Decisions** if facts changed.
- Refresh **Session Notes** when stopping mid-feature so the next session can resume.

Read `context/progress-tracker.md` at the start of a task to align with current phase and goal.

## After each meaningful change

1. Verify the unit works in scope (dev build or targeted test).
2. Update **`context/progress-tracker.md`** per the section above (and any other context file whose facts changed).
3. Run **`pnpm typecheck`** (and **`pnpm build`** when touching routes, env, or layout).

## Quick map

```
apps/app/
  app/              # App Router routes
  features/         # Domain UI (problem-detail, problems-page, admin, docs, …)
  components/       # Shared app components (e.g. split-layout)
  lib/              # Auth, API clients, problem fetchers
  docs/
    AGENTS.md       # Full agent entry point (this file)
    prd.md          # Full product requirements
    context/        # Spec pack (overview, architecture, UI, standards, tracker)
  AGENTS.md         # Cursor stub → points here (auto-loaded under apps/app/)
```

Cursor also loads **`.cursor/rules/codedrill-app.mdc`** when `apps/app/**` files are in context.
