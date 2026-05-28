# Implementation prompt (copy-paste)

Use for **`apps/nest-clerk-api`** only. Staged spec: `apps/app/docs/context/features-spec/clerk-neon-auth/`. **Do not modify `apps/api`** for this feature.

**Active now:** Stages 0, 1, 3, 4, 5 (backend). **Deferred:** 2, 6 (frontend), `@repo/clerk`.

---

## Prompt

Implement **Clerk authentication + Neon user provisioning + Nest authorization** for **CodeDrill** in **`apps/nest-clerk-api`**. Deliver backend stages before frontend. Complete acceptance criteria per stage before moving on.

### Constraints

- **Target:** `apps/nest-clerk-api/` only — no edits to `apps/api/`.
- **ORM:** Drizzle + Neon HTTP (`drizzle-orm/neon-http`), not Prisma.
- **No workspaces/boards** — Trellix tenancy model does not apply.
- **Webhook secret env:** `CLERK_WEBHOOK_SECRET` (exact name).
- **`@repo/clerk`:** out of scope (separate feature).

### Stage 0 — Drizzle + Neon

- Follow `00-drizzle.md`: `schema.ts`, `drizzle.ts`, `drizzle.config.ts`, `database.module.ts`.
- Scripts: `db:push`, `db:generate`, `db:migrate`, `db:studio`, plus `dev` / `build` / `test` / `typecheck` via `pnpm --filter nest-clerk-api`.

### Stage 1 — Foundation

- `users`: uuid `id`, unique `clerkUserId`, optional email/names/image, timestamps.
- `src/config/env.ts`: require `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`.
- `pnpm --filter nest-clerk-api db:push` after schema changes.

### Stage 2 — Clerk frontend (deferred)

- Skip until scheduled; use `@clerk/nextjs` in `apps/app`, call `NEST_CLERK_API_URL` (port 3031).

### Stage 3 — Webhook provisioning

- `POST /webhooks/clerk`: `rawBody: true`, `verifyWebhook`, `@Public()`.
- Events: `user.created`, `user.updated`, `session.created` (with user), `user.deleted`.
- Drizzle upsert on `clerkUserId`; delete on `user.deleted`.
- Enrich missing email via Clerk Backend API.
- No default workspace. Document ngrok + Clerk Dashboard.

### Stage 4 — API authentication

- Global `ClerkAuthGuard` + `@Public()` for health/webhooks.
- `UsersService.findByClerkId`; JWT without DB row → 404.
- `GET /me` returns **DB user** (not Clerk API as primary).

### Stage 5 — API authorization

- `*ForUser` Drizzle methods for user-owned data when routes are added.
- FK `user_id` → `users.id` with `onDelete: "cascade"` where possible.
- Wrong owner → 404. `userId` on create from DB user, not body.
- Use `apps/api/src/database/schema.ts` as domain reference only.

### Stage 6 — Provisioning UX (deferred)

- Gate on `GET /me` 200, not workspaces.

### Principles

1. Clerk owns identity; webhooks own `users` rows; JWT verify does not insert users.
2. Authorization = scoped Drizzle queries (no RLS unless required later).
3. Fail closed: no token → 401; no DB user → 404; wrong owner → 404.

### Reference paths

- `apps/nest-clerk-api/src/database/schema.ts`
- `apps/nest-clerk-api/src/database/drizzle.ts`
- `apps/nest-clerk-api/src/auth/`
- Drizzle setup: `apps/app/docs/context/features-spec/clerk-neon-auth/00-drizzle.md`
- Spec pack: `apps/app/docs/context/features-spec/clerk-neon-auth/`

### Final acceptance (backend slice)

- [ ] Clerk `user.created` → `users` row in Neon.
- [ ] `GET /me` with valid JWT returns DB user after webhook.
- [ ] Valid JWT before webhook → 404 on `/me`.
- [ ] Webhook unsigned/tampered → 400.
- [ ] `user.deleted` removes user (cascade when child FKs exist).
- [ ] No files changed under `apps/api/`.

### Final acceptance (full product, later)

- [ ] Sign up in `apps/app` → webhook → `/me` 200 → app shell loads (Stage 6).
- [ ] User A cannot access User B’s user-owned data (404).
