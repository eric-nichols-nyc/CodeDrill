# CodeDrill app (`apps/app`)

Before implementing or refactoring in this app, read and follow:

- **[docs/AGENTS.md](./docs/AGENTS.md)** — entry point, scope, commands, progress-tracker rules
- **[docs/context/progress-tracker.md](./docs/context/progress-tracker.md)** — current phase, goal, and backlog (read at task start; update when done)

Use the read order and feature UI rules defined in `docs/AGENTS.md`.

**Monorepo scope:** `apps/app/`, `apps/api/`, `apps/interview/`, and `packages/design-system/` — never search or edit other `apps/*` or `packages/*` unless the user explicitly expands scope. See repo-root [`AGENTS.md`](../../AGENTS.md).
