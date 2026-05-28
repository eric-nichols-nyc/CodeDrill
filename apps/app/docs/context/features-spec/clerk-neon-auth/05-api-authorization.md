# Stage 5: API authorization

**Goal:** User-owned CRUD in **`apps/nest-clerk-api`** only touches rows for the authenticated user. Authorization lives in **Drizzle** service queries, not client-supplied ids.

**Depends on:** [Stage 4 — API authentication](./04-api-authentication.md).

**Blocks:** Nothing (Stage 6 is parallel UX, deferred).

**Note:** Today `nest-clerk-api` only has `users`. This stage defines rules for **when** problem/progress/chat routes are added here or shared schema is extended — using **`apps/api/src/database/schema.ts`** as the domain reference, without editing `apps/api` in this feature.

---

## Scope

### Ownership model (CodeDrill)

| Resource | Scope |
|----------|--------|
| `users` | Self only (`clerkUserId` from JWT) |
| `problem_progress`, `submissions`, `problem_workspace_code`, `problem_chat_thread`, … | `user_id` → `users.id` (internal uuid), **or** filter by `clerkUserId` until FK migration |

**Schema chain (when nested routes exist):** e.g. `problem_chat_message` → `problem_chat_thread` → `users`.

Define FKs in Drizzle with `references(() => users.id, { onDelete: "cascade" })` so `user.deleted` webhook cascades app data.

### Controller pattern

1. Route is not `@Public()` (global guard).
2. `@CurrentUserId() clerkUserId: string`
3. `const user = await usersService.findByClerkId(clerkUserId)` — 404 if missing
4. Delegate to `*ForUser` service methods with `user.id`

### Service naming

- `findProgressForUser`, `upsertWorkspaceCodeForUser`, etc.
- No unscoped `findOne(id)` on tenant data without owner check.

### Drizzle patterns

**By internal user id:**

```ts
await db.query.problemProgress.findFirst({
  where: (t, { and, eq }) =>
    and(eq(t.id, progressId), eq(t.userId, user.id)),
});
```

**By clerk id (transitional, if column still stores Clerk sub):**

```ts
await db
  .select()
  .from(problemProgress)
  .where(
    and(
      eq(problemProgress.id, progressId),
      eq(problemProgress.userId, clerkUserId)
    )
  );
```

Prefer migrating `user_id` columns to FK → `users.id` for consistency with `clerkUserId` on the profile table.

**Deletes:** `delete` / `deleteMany` with scoped `where`; zero rows → 404.

### Cross-resource rules (when implemented)

- **Create progress / workspace code / chat:** set `userId` from `findByClerkId`, never from request body.
- **Read problem catalog:** may stay public or internal-secret on `apps/api` until merged; do not conflate with user auth.

### Failure semantics

- Wrong or another user’s id → **`NotFoundException` (404)**, not 403.

### Explicit non-goals

- Workspaces, boards, Trellix-style tenancy.
- Role-based access (admin, guest) unless product adds it later.
- Postgres RLS.

### Security hardening

- Any new user-owned route must use global guard (or explicit guard) + `*ForUser` methods.
- No unauthenticated list/get/delete on tenant data.

---

## Acceptance criteria

- [ ] User A cannot read/update User B’s progress (or equivalent) by id → 404.
- [ ] List endpoints return only rows for resolved `users.id`.
- [ ] Creates set `userId` from DB user, not request body.
- [ ] `user.deleted` webhook removes `users` row and cascades dependent rows (once FKs exist).
- [ ] `apps/api` unchanged by this feature.

---

## Reference (read-only)

- Domain tables: `apps/api/src/database/schema.ts`
- Auth implementation target: `apps/nest-clerk-api/src/`
