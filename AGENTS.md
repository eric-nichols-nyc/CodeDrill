# CodeDrill monorepo — agent scope

Before searching or editing code, read **[apps/app/docs/AGENTS.md](./apps/app/docs/AGENTS.md)** for product context and workflow.

## Monorepo scope constraints

You are strictly confined to:

- `apps/app/`
- `apps/api/`
- `packages/design-system/`

- NEVER index, read, or perform codebase searches across any other folders inside `apps/` or `packages/`.
- Treat all other application and package folders as completely out of scope to save token limits.
- If work requires paths outside this scope, ask the user before proceeding.

Cursor loads **`.cursor/rules/monorepo-scope.mdc`** (`alwaysApply: true`) and **`.cursorignore`** for indexing limits.
