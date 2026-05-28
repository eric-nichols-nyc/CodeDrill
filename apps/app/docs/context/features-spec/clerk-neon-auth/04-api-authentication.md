# Stage 4: API authentication

**Goal:** Protected routes verify Clerk JWT; handlers resolve **`user`** by `id = sub`. **`GET /me`** returns the DB row, not Clerk’s live API.

**Depends on:** Stages [1](./01-foundation.md), [3](./03-webhook-provisioning.md).

**Blocks:** Stage 5.

---

## Scope

### `ClerkService`

- `verifyToken` with `CLERK_SECRET_KEY`, optional `CLERK_AUTHORIZED_PARTIES`
- `createClerkClient` for webhook enrichment only

### `ClerkAuthGuard` (global)

- `APP_GUARD` + `@Public()` on `/api`, `/api/health`, `/api/webhooks/clerk` (`setGlobalPrefix("api")` in `main.ts`)
- Bearer JWT → `request.userId = payload.sub` (this **is** `user.id`)

### `@CurrentUserId()`

- Returns Clerk `sub` — same value stored in **`user.id`**

### `UsersService`

| Method | Use |
|--------|-----|
| `findById(id)` | `user` where `id = sub` |
| `upsertFromClerk(...)` | Webhook (Stage 3) |
| `deleteById(id)` | Webhook `user.deleted` |

Alias `findByClerkId` → `findById` is fine; there is **no** separate `clerk_user_id` column.

**Valid JWT + no `user` row → `404`** (webhook not synced). Never insert on JWT verify.

### `GET /api/me`

Return DB **`user`** fields, e.g.:

```json
{
  "id": "user_...",
  "name": "...",
  "email": "...",
  "emailVerified": true,
  "image": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Do **not** use `clerkClient.users.getUser` as the primary response.

---

## Acceptance criteria

- [ ] No `Authorization` → 401 (except `@Public()`).
- [ ] Bad JWT → 401.
- [ ] Valid JWT + `user` row → 200; `sub === user.id`.
- [ ] Valid JWT + missing row → 404.
- [ ] `GET /api/me` returns DB shape after webhook.
- [ ] Webhook stays `@Public()`.

---

## Out of scope

- `problem_*` authorization (Stage 5).
- `apps/api` Better Auth routes.
