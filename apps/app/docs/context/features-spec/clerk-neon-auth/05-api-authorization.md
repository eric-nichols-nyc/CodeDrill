# Stage 5: API authorization

**Goal:** User-owned data is scoped to **`user.id`** (= Clerk `sub`). Practice tables already use **`user_id` text** in `apps/api` schema — align values, do not invent a second id space.

**Depends on:** [Stage 4 — API authentication](./04-api-authentication.md).

**Blocks:** Nothing (Stage 6 deferred).

---

## Scope

### Ownership model

| Resource | Scope |
|----------|--------|
| **`user`** | Self only: `id = JWT sub` |
| **`problem_progress`, `submissions`, `problem_workspace_code`, `problem_chat_thread`, …** | `user_id = user.id` (text) |

**Today:** `apps/api/src/database/schema.ts` stores `userId` as **text without FK** to `user`. Queries must filter:

```ts
eq(problemProgress.userId, user.id)
```

where `user.id` is the Clerk `sub` string from `findById(sub)`.

### Legacy / orphan `user_id` rows

Dev DB may contain `user_id` values that **do not** match any current `user.id` (e.g. old Neon Auth UUIDs). New Clerk users use `user.id = sub`. Document migration or ignore orphans in dev.

**Future (optional):** add FK `user_id` → `user.id` with `onDelete: "cascade"` in a dedicated migration — not required for initial Clerk backend slice.

### Controller pattern

1. Global guard (not `@Public()`).
2. `@CurrentUserId() sub: string`
3. `const user = await usersService.findById(sub)` → 404 if missing
4. `*ForUser` methods receive `user.id`

### Service naming

- `findProgressForUser`, `upsertWorkspaceCodeForUser`, etc.
- Never trust `userId` from request body on create.

### Failure semantics

- Another user’s resource → **404**, not 403.

### Legacy Better Auth tables

Do not use `session.token` for API auth after Clerk cutover. `session` / `account` are not part of authorization checks.

---

## Acceptance criteria

- [ ] User A cannot access User B’s `problem_progress` (etc.) by id → 404.
- [ ] Lists filtered by `user_id = user.id`.
- [ ] Creates set `userId` from `findById(sub)`, not body.
- [ ] `user.deleted` webhook removes **`user`**; document orphan vs cascaded practice data.
- [ ] No `apps/api` source changes for this feature.

---

## Reference (read-only)

- Practice columns: `apps/api/src/database/schema.ts`
- Auth API: `apps/nest-clerk-api/src/`
