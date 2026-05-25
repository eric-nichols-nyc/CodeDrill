# Feature: problem-notes

## Goal

Persist **per-user, per-problem** scratch-pad notes from the workspace **Notes** tab to Postgres via a user-scoped Nest HTTP API. Today `ProblemNotes` only updates local React state (“saved locally in this session”); the `problem_learning_notes` table exists but has no write route. V1 is one freeform HTML note per signed-in user per problem, loaded on open and saved on explicit **Save**.

**Transport:** TanStack Query in the client calls **Nest directly** with `Authorization: Bearer`. No Next.js BFF route (`app/api/.../notes`) — Nest is the only API surface for this feature.

## Reference

- [01-design-system.md](./01-design-system.md) — feature UI layout.
- [00-index.md](./00-index.md) — feature registry.
- [11-workspace-refactor.md](./11-workspace-refactor.md) — `chat-note-panel/` owns Notes tab; `ProblemNotes` component.
- [08-api-auth-consolidation.md](./08-api-auth-consolidation.md) — Bearer token in `localStorage` (`readAuthTokenFromStorage()`).
- TanStack patterns in-repo: `features/problem-progress/hooks/`, `features/problem-workspace/editor-panel/queries/`.

## User story

As a signed-in learner working on a problem, I want my Notes tab content saved to my account, so I can return later and pick up where I left off.

## Current state

| Layer | Status |
| ----- | ------ |
| DB | `problem_learning_notes` in `apps/api/src/database/schema.ts` — columns: `problem_id`, `user_id` (nullable), `note_type`, `body`, `sort_order`, `created_at` |
| Catalog read | `GET /problems/by-slug/:slug` and `GET /problems/:id/details` return **all** rows for the problem (curated `user_id IS NULL` plus any personal rows) as `learningNotes` |
| Write API | **None** — `POST/PUT /problems` do not accept learning notes; no dedicated notes module |
| Nest CORS | **Not enabled** — required before browser → Nest client fetch works |
| UI | `features/problem-workspace/chat-note-panel/components/problem-notes.tsx` — ReactQuill editor; submit sets local “saved” state only |

## Requirements

### Data model (reuse existing table)

- **Personal note (v1):** one row per `(user_id, problem_id)` where `user_id` is set.
- **`note_type`:** always `"other"` for v1 (schema allows `confusion`, `memory_tip`, `pattern_rule`, `mistake`, `other`).
- **`body`:** HTML string from ReactQuill (same as editor output today).
- **`sort_order`:** `0`.
- **Upsert:** PUT creates or updates the personal row; does not touch curated rows (`user_id IS NULL`).
- **No row yet:** GET returns `{ body: "", updatedAt: null }` (or equivalent empty view).

**Curated vs personal:**

| `user_id` | Purpose | v1 write |
| --------- | ------- | -------- |
| `NULL` | Editorial/curated learning notes (tutor context, admin seed) | Out of scope — read via catalog |
| set | Learner scratch pad | GET + PUT |

Optional follow-up (not v1): filter catalog `learningNotes` to `user_id IS NULL` only so personal rows never leak in the public bundle.

### Nest API (`apps/api/src/problem-notes/`)

New module registered in `app.module.ts`. Reuse `ProblemsUserGuard` from `problem-workspace-code` (Bearer token via Better Auth session).

| Method | Path | Body | Response |
| ------ | ---- | ---- | -------- |
| `GET` | `/problems/:problemId/notes` | — | `ProblemPersonalNoteView` |
| `PUT` | `/problems/:problemId/notes` | `{ body: string }` | `ProblemPersonalNoteView` |

`ProblemPersonalNoteView`:

```ts
{
  body: string;        // HTML; empty string when no note
  updatedAt: string | null; // ISO; null when no row
}
```

Validation:

- `body` required on PUT; max length TBD (suggest 64 KiB — align with chat/editor limits).
- Trim-only body → treat as empty string; upsert row with empty body (prefer **upsert empty body** for simpler client).

Service responsibilities:

- `getForUser(userId, problemId)` — select personal row; verify problem exists (404 if invalid UUID / missing problem).
- `upsertForUser(userId, problemId, body)` — insert or update on conflict `(user_id, problem_id)` if unique index exists; otherwise select-then-insert/update.

**DB index (if missing):** add unique partial index on `(user_id, problem_id)` where `user_id IS NOT NULL` via schema + `db:push`.

### Nest CORS (prerequisite)

Enable CORS in `apps/api/src/main.ts` so the Next app origin can call Nest from the browser:

- Allow origins from `BETTER_AUTH_TRUSTED_ORIGINS` (already documents `http://localhost:3010`).
- Allow `Authorization` header and `GET`, `PUT`, `OPTIONS`.

Without this, client-side TanStack fetch to Nest will fail in the browser.

### App client (`apps/app/features/problem-workspace/chat-note-panel/`)

Extend the existing panel folder. **TanStack Query** owns load/save lifecycle; a thin fetch module calls Nest.

```txt
features/problem-workspace/chat-note-panel/
  components/
    problem-notes.tsx          # editor + dirty/saved UI; uses hooks below
  lib/
    notes-api.ts               # fetch GET/PUT → Nest (Bearer from storage)
    notes-keys.ts              # TanStack query keys
  hooks/
    use-problem-notes-query.ts
    use-upsert-problem-notes-mutation.ts
```

**`notes-api.ts`** (client-only):

- Base URL: add `NEXT_PUBLIC_NEON_JWT_API_URL` to `lib/auth/keys.ts` client schema (mirror server default `http://localhost:3030`). Do **not** import server-only `apiBaseUrl()` / `keys()` server fields from client code.
- Auth: `Authorization: Bearer ${readAuthTokenFromStorage()}` on every request; unsigned → skip fetch / throw `NOT_SIGNED_IN`.
- Paths: `${publicApiBase}/problems/${problemId}/notes`.

**TanStack hooks:**

- `useProblemNotesQuery(problemId)` — `enabled: !!problemId && isSignedIn`; `queryFn` → `fetchProblemNotes`.
- `useUpsertProblemNotesMutation(problemId)` — `mutationFn` → `saveProblemNotes`; `onSuccess` → invalidate notes query key.

**No Next BFF.** Do not add `apps/app/app/api/problems/[problemId]/notes/route.ts`.

`ChatPanel` passes `problemId` into `ProblemNotes` (from `useWorkspace().data.problemId`).

### UI behavior

- **Load:** Signed-in user → TanStack query fetches personal note; hydrate ReactQuill. While loading, show skeleton or disabled editor.
- **Save:** **Save** button triggers mutation; success → “Saved” + `updatedAt`; error → inline message, keep draft.
- **Unsaved changes:** Track dirty state vs last saved body; replace “saved locally in this session” copy.
- **Guest:** Query disabled; show “Sign in to save notes across sessions”; disable Save, allow local typing.
- **Initial value:** Stop using catalog `learningNotes` as the personal note source.

## System boundaries

| Layer | Path |
| ----- | ---- |
| Drizzle schema | `apps/api/src/database/schema.ts` → `problemLearningNotes` (+ unique index if added) |
| Nest module | `apps/api/src/problem-notes/` (`controller`, `service`, `module`, `dto/upsert-problem-note.dto.ts`) |
| Nest CORS | `apps/api/src/main.ts` |
| Client env | `apps/app/lib/auth/keys.ts` → `NEXT_PUBLIC_NEON_JWT_API_URL` |
| Feature UI + data | `apps/app/features/problem-workspace/chat-note-panel/` |
| Docs | `apps/api/README.md` — notes endpoints + CORS note |

## Proposed Nest file structure

```txt
apps/api/src/problem-notes/
  problem-notes.module.ts
  problem-notes.controller.ts
  problem-notes.service.ts
  dto/
    upsert-problem-note.dto.ts
```

## Component responsibilities

### `ProblemNotes`

- Accept `problemId: string`.
- Own editor state, dirty/saved/error UI.
- Use `useProblemNotesQuery` + `useUpsertProblemNotesMutation`.

### `ChatPanel`

- Pass `problemId` to `ProblemNotes`; remove `learningNotes` prop from notes tab.

## Routes (thin)

- `apps/app/app/problems/[slug]/page.tsx` — no change required; notes load client-side via `problemId` in workspace context.

## Out of scope (v1)

- Next.js BFF proxy routes for notes (or migrating existing workspace-code/progress BFFs).
- Admin CRUD for curated learning notes (`user_id IS NULL`) via admin UI or `CreateProblemDto`.
- Multiple typed notes per user — schema supports it; UI is single scratch pad.
- Auto-save / debounced save (explicit Save only).
- Merging catalog curated notes into the editor.
- Server Actions for notes (client TanStack → Nest is sufficient).

## Acceptance criteria

- [ ] Unique constraint (or equivalent upsert logic) for personal `(user_id, problem_id)` documented and applied.
- [ ] Nest `GET` / `PUT` `/problems/:problemId/notes` registered in `app.module.ts`.
- [ ] Nest CORS allows Next app origin + `Authorization` header.
- [ ] `NEXT_PUBLIC_NEON_JWT_API_URL` available to client fetch helpers.
- [ ] TanStack query + mutation load/save via Nest (no `app/api/.../notes` route).
- [ ] `ProblemNotes` loads saved body after reload for signed-in user.
- [ ] Save persists HTML body; status reflects saved vs unsaved vs error.
- [ ] Guest sees sign-in messaging; Save disabled; no API calls.
- [ ] Spec registered in [00-index.md](./00-index.md).
- [ ] `apps/api/README.md` documents notes endpoints.
- [ ] `pnpm typecheck` passes (`apps/app`, `apps/api`).

## Implementation prompt for agents

Implement **problem-notes** per this spec and [01-design-system.md](./01-design-system.md).

1. Add `problem-notes` Nest module mirroring `problem-workspace-code` (guard, controller shape, upsert service).
2. Enable Nest CORS for trusted origins.
3. Add `NEXT_PUBLIC_NEON_JWT_API_URL` to client env; implement `notes-api.ts` with Bearer from `readAuthTokenFromStorage()`.
4. Add TanStack hooks under `chat-note-panel/`; update `ProblemNotes` and `ChatPanel`.
5. Do **not** add a Next BFF route or admin learning-notes fields on `POST/PUT /problems`.
6. Update `apps/api/README.md` and [00-index.md](./00-index.md) status when shipped.
7. Run `pnpm typecheck` in `apps/app` and `apps/api`.
