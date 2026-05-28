# Stage 1: Foundation

**Goal:** Drizzle model for the existing Better Auth **`user`** table, env validation, and DB access in **`apps/nest-clerk-api`**.

**Depends on:** [Stage 0 — Drizzle + Neon](./00-drizzle.md).

**Blocks:** Stages 3, 4, 5.

**Out of scope:** Edits to `apps/api/`, new `users` / `clerk_user_id` tables, `@repo/clerk`.

---

## Scope

### Reuse `user` (not `users`)

The live database already has **`user`** from Better Auth (`pnpm --filter neon-jwt-api auth:migrate`). Columns (camelCase in Postgres):

| Column | Type | Clerk mapping |
|--------|------|----------------|
| `id` | `text` PK | **`user.id` = Clerk JWT `sub`** |
| `name` | `text` NOT NULL | `firstName` + `lastName` or Clerk `fullName` |
| `email` | `text` NOT NULL | Primary email from webhook |
| `emailVerified` | `boolean` NOT NULL | From Clerk email verification state |
| `image` | `text` nullable | Clerk `imageUrl` |
| `createdAt` | `timestamptz` NOT NULL | Set on insert |
| `updatedAt` | `timestamptz` NOT NULL | Bump on upsert |

In Drizzle use `pgTable("user", { ... })` (Postgres table name `user`). Export `export const schema = { user }`.

**Do not** `db:push` a new `users` table with uuid + `clerk_user_id` — that duplicates identity and fights existing data.

### Legacy Better Auth tables (read-only for Clerk)

| Table | Action |
|-------|--------|
| `session` | Do not create on Clerk sign-in; delete rows for `userId` on `user.deleted` if FK blocks delete |
| `account` | Same — legacy credentials |
| `verification` | Leave untouched |

Optional: omit `session` / `account` from `nest-clerk-api` Drizzle schema until you need queries; they remain in the DB.

### Drizzle client + database module

Per [00-drizzle.md](./00-drizzle.md). Stage 1 adds:

- `src/config/env.ts` — require `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`
- `UsersService` with `findById(id: string)` where `id` is JWT `sub`

### `db:push` caution (shared DB)

Only tables declared in `nest-clerk-api/src/database/schema.ts` are managed by its kit run. With **only `user`** in schema:

- Push should be a **no-op** if Drizzle definition matches existing Better Auth DDL.
- If definitions differ, review diff before pushing — you share the DB with `apps/api` and all practice tables.

Prefer matching the live columns exactly over “improving” the schema in this app.

---

## Acceptance criteria

- [ ] `schema.ts` defines **`user`** matching live Better Auth columns (no `users` table).
- [ ] `UsersService.findById(sub)` returns a row after webhook upsert.
- [ ] `drizzle.ts` + `DRIZZLE` provider work against shared `DATABASE_URL`.
- [ ] Startup fails fast without required Clerk/DB env vars.
- [ ] No edits under `apps/api/`.

---

## Out of scope (later stages)

- Webhooks, `GET /me`, guard wiring beyond skeleton, `*ForUser` on practice tables, Next.js UI.
