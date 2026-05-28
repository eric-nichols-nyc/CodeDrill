# Stage 4: API authentication

**Goal:** Protected routes on **`apps/nest-clerk-api`** reject invalid callers; valid Clerk sessions resolve to a local **`users`** row. `GET /me` returns the **DB user**, not Clerk’s live API profile.

**Depends on:** [Stage 1 — Foundation](./01-foundation.md), [Stage 3 — Webhook provisioning](./03-webhook-provisioning.md) (for populated DB during testing).

**Blocks:** [Stage 5 — API authorization](./05-api-authorization.md).

---

## Scope

### `ClerkService` (`apps/nest-clerk-api/src/auth/clerk.service.ts`)

- `verifyToken` via `@clerk/backend` with `CLERK_SECRET_KEY`
- Optional `CLERK_AUTHORIZED_PARTIES` (comma-separated)
- `createClerkClient` for webhook enrichment only

### `ClerkAuthGuard` — global (preferred)

Use **`APP_GUARD`** + `@Public()` on health, root, and `/webhooks/clerk`:

- Parse `Authorization: Bearer <token>`
- Missing/invalid → `401 Unauthorized`
- On success: attach JWT payload and `request.userId = payload.sub` (Clerk id)

Simpler than per-route `@UseGuards` for a small API; new public routes must opt in with `@Public()`.

**Reference:** `apps/nest-clerk-api/src/auth/auth.module.ts`, `clerk-auth.guard.ts`, `public.decorator.ts`.

### `@CurrentUserId()` decorator

- Returns Clerk `sub` (`clerkUserId`) from the request
- Controllers pass this to `UsersService.findByClerkId`

### `UsersService` (`apps/nest-clerk-api/src/users/`)

| Method | Use |
|--------|-----|
| `findByClerkId(clerkUserId)` | Resolve DB user |
| `upsertFromClerk(...)` | Used by webhook (may live in service or webhooks layer) |
| `deleteByClerkId(clerkUserId)` | Webhook `user.deleted` |

**Valid JWT + no DB row → `404`** with a clear message (webhook not synced yet). Do not auto-insert on JWT verify.

### `GET /me`

- Protected (no `@Public()`)
- Response: DB `users` row (id, clerkUserId, email, names, imageUrl, timestamps)
- **Not** `clerkClient.users.getUser` as the primary source

### Auth module

- Global guard + export `ClerkService`, `UsersModule`

---

## Acceptance criteria

- [ ] Request without `Authorization` → 401 (except `@Public()` routes).
- [ ] Expired/invalid JWT → 401.
- [ ] Valid JWT + existing `users` row → handler runs; `sub` matches `clerkUserId`.
- [ ] Valid JWT + missing row → 404.
- [ ] `GET /me` returns DB fields after webhook provisioning.
- [ ] `POST /webhooks/clerk` stays `@Public()` (no JWT).

---

## Out of scope

- Ownership filters on problem/progress/chat rows (Stage 5).
- Next.js provisioning screen (Stage 6).
- Modifying `apps/api` auth.
