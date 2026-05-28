# Implementation prompt (copy-paste)

Use for **`apps/nest-clerk-api`** only. Spec: `apps/app/docs/context/features-spec/clerk-neon-auth/`. **Do not modify `apps/api`**.

**Active:** Stages 0, 1, 3, 4, 5. **Deferred:** 2, 6, `@repo/clerk`.

---

## Prompt

Implement **Clerk + Neon** for CodeDrill in **`apps/nest-clerk-api`**. The database is usually **shared with `apps/api`** and already has Better Auth tables.

### Hard constraints

- **Only** `apps/nest-clerk-api/**`
- **Reuse existing `user` table** — `id` (text) = Clerk JWT `sub`. **No** `users` table, **no** `clerk_user_id` column.
- **Do not** write to `session` / `account` on Clerk sign-in (legacy Better Auth).
- On `user.deleted`: delete `session` + `account` for that `userId`, then delete `user`.
- Env: `CLERK_WEBHOOK_SECRET` (exact name).
- Run without asking: `pnpm --filter nest-clerk-api test`, `typecheck`, `build`; `db:push` only after confirming schema matches live `user` DDL.

### Database (read first)

Live tables include: `user`, `session`, `account`, `verification`, plus practice tables. See [README.md](./README.md) § Database model.

**`user` columns:** `id`, `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt` (camelCase in Postgres).

### Stage 0 — Drizzle

- [00-drizzle.md](./00-drizzle.md): `drizzle.ts`, `DRIZZLE`, shared DB rules.
- `schema.ts` → `pgTable("user", …)` only for auth (do not pull entire DB).

### Stage 1 — Foundation

- Match Better Auth `user` in Drizzle.
- `src/config/env.ts`: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`.
- `UsersService.findById(sub)`.

### Stage 3 — Webhook

- `setGlobalPrefix("api")`; `POST /api/webhooks/clerk`, `rawBody: true`, `@Public()`.
- Upsert `user` with `id = Clerk sub`; map name/email/image/emailVerified.
- `user.deleted` → delete legacy `session`/`account`, then `user`.

### Stage 4 — Auth

- Global `ClerkAuthGuard`; `@CurrentUserId()` = `sub` = `user.id`.
- `GET /api/me` → DB `user` row; JWT without row → 404.

### Stage 5 — Authorization

- Scope practice rows with `user_id = user.id` (text); see `apps/api/src/database/schema.ts` (reference only).
- Orphan `user_id` from pre-Clerk ids — document, do not fix in `apps/api`.

### Principles

1. Clerk owns sessions; DB `session` table is legacy.
2. Webhooks provision **`user`**; JWT verify does not insert.
3. Fail closed: 401 / 404 / 404.

### Acceptance

- [ ] No `users` table created in Neon
- [ ] Webhook creates `user` with `id = sub`
- [ ] `GET /api/me` returns DB user
- [ ] No files under `apps/api/`
