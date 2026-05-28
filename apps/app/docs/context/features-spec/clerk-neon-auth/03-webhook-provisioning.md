# Stage 3: Webhook provisioning

**Goal:** When Clerk creates or updates a user, **`apps/nest-clerk-api`** upserts a row in `users` — without relying on the first authenticated API call.

**Depends on:** [Stage 1 — Foundation](./01-foundation.md).

**Blocks:** [Stage 4 — API authentication](./04-api-authentication.md) (meaningful `GET /me`), [Stage 6 — Provisioning UX](./06-provisioning-ux.md) (when scheduled).

---

## Scope

### Endpoint

- `POST /webhooks/clerk` on **`apps/nest-clerk-api`**
- Mark **`@Public()`** so the global `ClerkAuthGuard` does not run
- Authenticated via Svix signature only (`CLERK_WEBHOOK_SECRET`)

### Request handling

1. Bootstrap with `NestFactory.create(AppModule, { rawBody: true })`.
2. Verify with `@clerk/backend/webhooks` `verifyWebhook(request, { signingSecret: process.env.CLERK_WEBHOOK_SECRET })`.
3. Branch on `evt.type`.

### Handled events

| Event | Action |
|-------|--------|
| `user.created` | Upsert `users` by `clerkUserId` |
| `user.updated` | Upsert profile fields |
| `session.created` | Upsert when `data.user` present (Clerk Dashboard **Testing** tab) |
| `user.deleted` | Delete `users` where `clerkUserId` matches (cascade to child rows when FKs exist) |

Other verified events: return `{ ok: true, synced: false }` and log the type.

### `ensureUser(clerkUser)` (Drizzle)

1. **Enrich email** — if payload lacks email, `clerkClient.users.getUser(id)` when `CLERK_SECRET_KEY` is set.
2. **Upsert** on `clerkUserId` — set `email`, `firstName`, `lastName`, `imageUrl`, `updatedAt`.
3. **No default workspace** — CodeDrill has no workspace model.

Use `insert … onConflictDoUpdate` (or equivalent) on `users.clerk_user_id`.

### Clerk Dashboard

1. Webhook URL: `https://<host>/webhooks/clerk` (ngrok locally).
2. Signing secret → `CLERK_WEBHOOK_SECRET` in `apps/nest-clerk-api/.env`.
3. Subscribe: `user.created`, `user.updated`, `user.deleted`, `session.created` (as needed).

### Local development checklist

- [ ] `pnpm --filter nest-clerk-api dev` (port **3031** by default).
- [ ] `ngrok http 3031` → HTTPS URL in Clerk.
- [ ] `CLERK_WEBHOOK_SECRET` matches Dashboard.
- [ ] Clerk Dashboard → Webhooks → **Testing** → `user.created`.

Document steps in `apps/nest-clerk-api/README.md` when implemented.

---

## Acceptance criteria

- [ ] Unsigned or tampered body → 400.
- [ ] `user.created` creates `users` row with correct `clerkUserId` and email.
- [ ] Repeat `user.created` / `user.updated` is idempotent (no duplicate `clerkUserId`).
- [ ] `user.deleted` removes the `users` row; future child FKs use Drizzle `onDelete: "cascade"`.
- [ ] Logs indicate successful sync for handled events.
- [ ] No changes under `apps/api/`.

---

## Out of scope

- JWT verification on normal routes (Stage 4).
- Scoping problem/progress tables (Stage 5).
- Next.js UI (Stages 2, 6).
