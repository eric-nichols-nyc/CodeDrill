# Repository Agent Entry

This is the root entry point for AI agents working in the CodeDrill monorepo.

## Scope

Default in-scope paths:

- `apps/app/`
- `apps/api/`
- `packages/design-system/`

Do not search, read, or edit other folders under `apps/` or `packages/` unless the user explicitly expands scope. Treat other apps and packages as out of scope to save token limits.

If work appears to require paths outside this scope, ask before proceeding.

Indexing limits: **`.cursorignore`**, **`.cursor/rules/monorepo-scope.mdc`** (`alwaysApply: true`).

## Monorepo

This repo is a **pnpm + Turborepo** monorepo. Shared workspace packages are imported as `@repo/<name>`.

| Path | Role |
|------|------|
| `apps/app` | Next.js UI (marketing, problems, workspace, admin) |
| `apps/api` | NestJS practice API (catalog, auth, Drizzle/Postgres) |
| `packages/design-system` | shadcn/ui primitives for `@repo/design-system` |

Cross-app conventions (high level):

- Prefer Server Components; add `'use client'` only where needed.
- UI primitives: `@repo/design-system/components/ui/*` — add via `npx shadcn@latest add <component> -c packages/design-system` (do not fork under `apps/app`).
- Default split: UI in `apps/app`; data and server logic often in `apps/api` — do not change the API unless the task requires it.

Root workspace config (`package.json`, `pnpm-workspace.yaml`, `turbo.json`, `biome.jsonc`) may be read for commands; do not implement product features there.

## Read First

For **app / product work** (default):

1. Read [`apps/app/AGENTS.md`](./apps/app/AGENTS.md)
2. Read [`apps/app/docs/AGENTS.md`](./apps/app/docs/AGENTS.md) and follow its context read order
3. Read [`apps/app/docs/context/progress-tracker.md`](./apps/app/docs/context/progress-tracker.md)
4. Read the relevant spec under [`apps/app/docs/context/features-spec/`](./apps/app/docs/context/features-spec/) (start from [`00-index.md`](./apps/app/docs/context/features-spec/00-index.md))

For **API-only work** (`apps/api`):

1. Still read [`apps/app/docs/AGENTS.md`](./apps/app/docs/AGENTS.md) for product scope and invariants when behavior touches the UI or PRD.
2. Align API changes with [`apps/app/docs/prd.md`](./apps/app/docs/prd.md) and context files when requirements are unclear.

Agent reference docs (optional, task-specific): [`apps/app/docs/reference/`](./apps/app/docs/reference/).

## Rules

- Follow documented feature specs and context files; do not invent requirements.
- Ask when requirements are ambiguous; note open questions in the progress tracker when appropriate.
- Keep changes scoped to the requested feature.
- Update [`apps/app/docs/context/progress-tracker.md`](./apps/app/docs/context/progress-tracker.md) after meaningful work unless the user explicitly excludes doc updates.
