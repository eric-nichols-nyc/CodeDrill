# Feature: problem-progress

## Goal

Persist **per-user, per-problem** state: solve status (`not_started` | `attempted` | `solved`) and **favorite** (`isFavorite`). Expose it through a user-scoped HTTP API, a Next.js BFF, and a reusable app feature folder so list and detail pages can toggle/read progress without using admin catalog routes (`PUT /problems/:id`).

## Reference

- [01-design-system.md](./01-design-system.md) — feature UI layout.
- [00-index.md](./00-index.md) — feature registry.
- Workspace-code pattern (same auth, BFF shape): `apps/app/docs/workspace-code-save-flow.md`, `features/problem-workspace/.../workspace-code/`.

## User story

As a signed-in learner, I want to favorite a problem and have that choice saved, so I can find it again across sessions.

## Requirements

### Data model

- Table: `problem_progress` in `apps/api/src/database/schema.ts`.
- Unique on `(user_id, problem_id)`.
- Columns used in v1 API response: `status`, `is_favorite`, `updated_at`.
- No row yet → API returns defaults: `status: "not_started"`, `isFavorite: false`.

### Nest API (`apps/api/src/problem-progress/`)

| Method | Path | Guard | Body | Response |
| ------ | ---- | ----- | ---- | -------- |
| `GET` | `/problems/:problemId/progress` | `ProblemsUserGuard` | — | `ProblemProgressView` |
| `PATCH` | `/problems/:problemId/progress` | `ProblemsUserGuard` | partial `{ isFavorite?, status? }` | `ProblemProgressView` |

`ProblemProgressView`:

```ts
{
  status: "not_started" | "attempted" | "solved";
  isFavorite: boolean;
  updatedAt: string; // ISO
}
```

- Upsert on PATCH (insert on first interaction).
- Reuse `ProblemsUserGuard` from `problem-workspace-code` (session or `x-internal-problems-secret` + `x-user-id`).
- **Not** on `PUT /problems/:id` (admin catalog).

### Next BFF

- `apps/app/app/api/problems/[problemId]/progress/route.ts`
- Proxies `GET` and `PATCH` to Nest with `upstreamUserHeaders()`.
- Same 401 / secret hints as workspace-code BFF.

### App feature (`apps/app/features/problem-progress/`)

```txt
features/problem-progress/
  lib/
    types.ts
    progress-api.ts       # fetch /api/problems/:id/progress
    progress-keys.ts
  hooks/
    use-problem-progress-query.ts
    use-patch-problem-progress-mutation.ts
  components/
    problem-favorite-button.tsx
```

- Client calls **BFF only** (`/api/problems/.../progress`), never Nest directly.
- `ProblemFavoriteButton` toggles `isFavorite` via PATCH.

### UI integration (not done in scaffold pass)

- [ ] Problem detail header: `<ProblemFavoriteButton problemId={id} />`.
- [ ] Problems list row (optional star).
- [ ] Nav “Favorite” filter → needs `GET` list of favorited problems (future API).

## System boundaries

| Layer | Path |
| ----- | ---- |
| Drizzle schema | `apps/api/src/database/schema.ts` → `problemProgress` |
| Nest module | `apps/api/src/problem-progress/` |
| BFF | `apps/app/app/api/problems/[problemId]/progress/route.ts` |
| Feature UI | `apps/app/features/problem-progress/` |

Apply DB changes: `cd apps/api && pnpm db:push` (column `is_favorite`).

## Out of scope (v1)

- Updating `status` from submit/judge pipeline (schema ready; wiring later).
- `GET /problems?favorites=true` catalog filter.
- Guest/anonymous favorites.

## Acceptance criteria

- [x] `problem_progress.is_favorite` in schema + SQL reference.
- [x] Nest `GET` / `PATCH` `:problemId/progress` registered in `app.module.ts`.
- [x] BFF route proxies GET/PATCH.
- [x] Feature folder with lib, hooks, `ProblemFavoriteButton`.
- [ ] Button wired on at least one page.
- [ ] Signed-in user can toggle favorite and see it after reload.
- [ ] `pnpm typecheck` passes (`apps/app`, `apps/api`).

## Implementation notes for agents

1. Read this spec + `01-design-system.md` before changing UI.
2. Do not add `isFavorite` to `CreateProblemDto` / admin `PUT /problems/:id`.
3. When extending progress (e.g. status from submit), update this spec and PATCH DTO together.
