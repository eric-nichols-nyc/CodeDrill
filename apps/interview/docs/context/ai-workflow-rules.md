# AI Workflow Rules

Tactical rules for day-to-day work. For **which docs to create and in what order**, see **[planning-checklist.md](../planning-checklist.md)**.

## Approach

Build incrementally using a spec-driven workflow. **`docs/prd.md`** defines what to build; context files define architecture and progress. Do not infer product behavior beyond the PRD.

## Scoping Rules

- Work on one feature unit at a time (e.g. one MVP screen, one integration slice)
- Prefer small, verifiable increments
- Static prototype must stay free of auth/API/AI until explicitly scoped

## When to Split Work

Split if a change combines:

- UI and backend persistence in one step
- Multiple MVP screens without a clear vertical slice
- Behavior not defined in `prd.md` or a feature spec

## Protected Files

- `packages/design-system/components/ui/**` — shadcn CLI only
- Do not add Clerk, Drizzle, or AI SDK until a context file or feature spec authorizes it

## Doc Sync

After meaningful changes:

1. Update `context/progress-tracker.md`
2. Update `architecture.md` if boundaries or env changed
3. Add or update specs under `docs/feature-specs/` when introducing new behavior

## Verification

- Run `pnpm typecheck` from `apps/interview` when touching types or routes
- Manually click through static prototype routes after UI changes
