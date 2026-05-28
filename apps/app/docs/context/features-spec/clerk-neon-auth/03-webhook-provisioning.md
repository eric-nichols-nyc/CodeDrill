# Stage 3: Webhook provisioning

**Goal:** Clerk `user.created` / `user.updated` upserts the existing **`user`** table (`id` = Clerk `sub`). No separate `users` or `clerk_user_id` column.

**Depends on:** [Stage 1 — Foundation](./01-foundation.md).

**Blocks:** Stage 4 (`GET /me`), Stage 6 (when scheduled).

---

## Scope

### Endpoint

- `POST /api/webhooks/clerk` on **`apps/nest-clerk-api`**
- **`@Public()`** — Svix signature only (`CLERK_WEBHOOK_SECRET`)
- `NestFactory.create(AppModule, { rawBody: true })`

### Handled events

| Event | Action |
|-------|--------|
| `user.created` | Insert or upsert **`user`** with `id = clerkUserId` (`sub`) |
| `user.updated` | Upsert `name`, `email`, `emailVerified`, `image`, `updatedAt` |
| `session.created` | Same upsert when `data.user` present (Clerk Testing tab) |
| `user.deleted` | Delete `session` + `account` for `userId`, then delete **`user`** |

Other verified events: `{ ok: true, synced: false }` + log.

### `ensureUser(clerkUser)` (Drizzle)

1. **Enrich** — if email missing, `clerkClient.users.getUser(id)`.
2. **Upsert `user`** on `id` (Clerk `sub`):

```ts
// Conceptual mapping
id: clerkUser.id
name: [firstName, lastName].filter(Boolean).join(" ") || clerkUser.username || email
email: primaryEmail
emailVerified: /* from Clerk primary email verification */
image: clerkUser.imageUrl ?? null
updatedAt: new Date()
```

3. **No** `session` / `account` rows for Clerk users.
4. **No** workspace / `users` table.

Use `insert … onConflictDoUpdate` on **`user.id`**.

### `user.deleted`

Better Auth `session` and `account` reference `user.id`. Delete child rows first (or rely on DB `ON DELETE CASCADE` if present), then delete **`user`**. Practice tables (`problem_progress`, etc.) use loose `user_id` text **without FK** — orphaned rows may remain until Stage 5 adds FKs or a cleanup job.

### Clerk Dashboard

- URL: `https://<host>/api/webhooks/clerk` (ngrok → port **3031**)
- Secret → `CLERK_WEBHOOK_SECRET`
- Events: `user.created`, `user.updated`, `user.deleted`, `session.created` (optional)

---

## Acceptance criteria

- [ ] Invalid signature → 400.
- [ ] `user.created` creates **`user`** row with `id` = Clerk `sub` and email.
- [ ] Idempotent upsert on repeat events.
- [ ] `user.deleted` removes **`user`** (and legacy `session` / `account` for that id).
- [ ] No new `users` table in Neon.
- [ ] No changes under `apps/api/`.

---

## Out of scope

- JWT on normal routes (Stage 4).
- Scoping `problem_*` tables (Stage 5).
