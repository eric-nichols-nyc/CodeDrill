# Stage 1: Foundation

**Goal:** `users` table on Neon, Drizzle client wiring, and startup env validation in **`apps/nest-clerk-api`**.

**Depends on:** [Stage 0 — Drizzle + Neon](./00-drizzle.md) (`db:push`, `drizzle.ts`, `DRIZZLE` provider).

**Blocks:** Stages 3, 4, 5.

**Out of scope for this repo path:** Changes to `apps/api`, `packages/clerk`, or `@repo/clerk`.

---

## Scope

### Drizzle schema (`apps/nest-clerk-api/src/database/schema.ts`)

Define `users` at minimum:

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` PK | Internal id for FKs from future user-owned tables |
| `clerkUserId` | `text` unique, not null | Clerk JWT `sub` |
| `email` | `text` optional | From webhook / Clerk API |
| `firstName` | `text` optional | |
| `lastName` | `text` optional | |
| `imageUrl` | `text` optional | |
| `createdAt` / `updatedAt` | `timestamptz` | |

**No** `Workspace`, `Board`, or Trellix entities.

When CodeDrill user-owned tables are added to this API (e.g. progress, submissions), they should reference `users.id` with `onDelete: "cascade"` in Drizzle — see Stage 5 and `apps/api/src/database/schema.ts` for the eventual shape.

### Drizzle client + database module

Implemented per [00-drizzle.md](./00-drizzle.md): `drizzle.ts`, `database.module.ts`, and scripts (`db:push`, `db:generate`, `db:migrate`, `db:studio`).

Stage 1 adds **`DatabaseService`** (or keeps DB access in `UsersService`) on top of the existing `DRIZZLE` provider.

### API env validation (`apps/nest-clerk-api/src/config/env.ts`)

Fail fast at bootstrap if missing:

- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET` (exact name — Clerk Dashboard signing secret)

Optional:

- `CLERK_AUTHORIZED_PARTIES` — comma-separated origins for `verifyToken`

### Deferred (separate features)

- **`@repo/clerk` package** — not part of this stage; Stage 2 will use `@clerk/nextjs` in `apps/app` when scheduled.
- **`apps/app/env.ts`** — document `NEST_CLERK_API_URL` (or similar) when frontend work starts; default dev port **3031**.

---

## Acceptance criteria

- [ ] `users` table exists with unique `clerk_user_id` and uuid `id`.
- [ ] `drizzle.ts` provides typed `DrizzleDb` and Nest `DRIZZLE` provider.
- [ ] API starts and connects to Neon via HTTP driver.
- [ ] Missing `DATABASE_URL`, `CLERK_SECRET_KEY`, or `CLERK_WEBHOOK_SECRET` fails at startup.
- [ ] No edits under `apps/api/` for this feature.

---

## Out of scope (later stages)

- Webhooks, `UsersService`, `GET /me` DB response, global guard behavior beyond existing skeleton, `*ForUser` services, Next.js UI.
