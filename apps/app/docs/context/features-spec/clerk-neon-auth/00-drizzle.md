# Stage 0: Drizzle + Neon setup

**Goal:** Initialize and operate **Drizzle ORM** against **Neon Postgres** in **`apps/nest-clerk-api`** — schema files, runtime client, and `drizzle-kit` CLI.

**Depends on:** Nothing (read this before [Stage 1 — Foundation](./01-foundation.md)).

**Blocks:** Stages 1, 3, 4, 5.

**Package name (pnpm filter):** `nest-clerk-api`

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| Node.js **22.x** | Matches `engines` in `apps/nest-clerk-api/package.json` |
| [pnpm](https://pnpm.io/) | Monorepo root `pnpm install` |
| [Neon](https://neon.tech/) project | Postgres connection string for `DATABASE_URL` |
| Dependencies installed | From repo root: `pnpm install` |

Use the Neon **connection string** that works with the serverless HTTP driver (copy from Neon Console → Connect). Pooler URLs are fine for `drizzle-kit` and `@neondatabase/serverless`.

---

## File layout (`apps/nest-clerk-api`)

```
apps/nest-clerk-api/
  drizzle.config.ts          # drizzle-kit CLI (schema path, migrations out dir)
  drizzle/                   # SQL migrations (after db:generate) — git-tracked
  src/database/
    schema.ts                # Table definitions + exported `schema` object
    drizzle.ts               # createNeonDrizzle(), DRIZZLE / NEON_SQL tokens
    database.module.ts       # Nest providers (loads .env, wires db)
    database.service.ts      # Injectable DB helpers (optional)
  .env                       # DATABASE_URL (not committed)
  .env.local                 # Optional local overrides
```

**Rule:** Put **tables** in `schema.ts`. Put **client factory + injection tokens** in `drizzle.ts`. Do not duplicate schema in `drizzle.config.ts` — kit reads `schema.ts` via the `schema` path in config.

---

## Environment

Create **`apps/nest-clerk-api/.env`**:

```env
DATABASE_URL=postgresql://...@...neon.tech/neondb?sslmode=require
```

`drizzle.config.ts` and `database.module.ts` also load `.env.local` and `.env.production` when present.

Clerk vars (`CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`) are required for the API at runtime — see [README](./README.md). They are **not** required for drizzle-kit-only commands if `DATABASE_URL` is set.

---

## Dependencies (already in `package.json`)

| Package | Role |
|---------|------|
| `drizzle-orm` | Runtime ORM |
| `drizzle-kit` | CLI (devDependency) |
| `@neondatabase/serverless` | Neon HTTP driver (`neon()`) |

Runtime adapter: **`drizzle-orm/neon-http`** (not `node-postgres` / `pg` pool in this app).

---

## Initialize Drizzle (first time on a fresh DB)

From **monorepo root**:

```bash
# 1. Install workspace deps
pnpm install

# 2. Ensure DATABASE_URL is in apps/nest-clerk-api/.env

# 3. Apply schema to Neon (development — no migration files yet)
pnpm --filter nest-clerk-api db:push
```

**`db:push`** compares `src/database/schema.ts` to the live database and applies DDL. Use this while iterating on the auth slice before you commit to versioned migrations.

### Optional: versioned migrations (production-friendly)

When the schema stabilizes:

```bash
# Generate SQL under apps/nest-clerk-api/drizzle/
pnpm --filter nest-clerk-api db:generate

# Apply migrations to Neon
pnpm --filter nest-clerk-api db:migrate
```

Commit the `drizzle/` folder. Prefer **`db:migrate`** in CI/production; use **`db:push`** for fast local iteration.

---

## pnpm scripts reference

All scripts live in **`apps/nest-clerk-api/package.json`**. Run from repo root with **`--filter nest-clerk-api`** (or `cd apps/nest-clerk-api && pnpm <script>`).

### Database (drizzle-kit)

| Script | Command | When to use |
|--------|---------|-------------|
| **`db:push`** | `drizzle-kit push --strict` | **Default for dev** — sync schema.ts → Neon without migration files. Fails if push would be destructive without acknowledgment (`--strict`). |
| **`db:generate`** | `drizzle-kit generate` | After changing `schema.ts` — writes new SQL migration(s) to `drizzle/`. |
| **`db:migrate`** | `drizzle-kit migrate` | Apply pending migrations from `drizzle/` to Neon. |
| **`db:studio`** | `drizzle-kit studio` | Local Drizzle Studio UI to browse/edit data. |

**Copy-paste cheatsheet:**

```bash
# Push schema (dev)
pnpm --filter nest-clerk-api db:push

# Migration workflow
pnpm --filter nest-clerk-api db:generate
pnpm --filter nest-clerk-api db:migrate

# Browse data
pnpm --filter nest-clerk-api db:studio
```

### API runtime

| Script | Command | When to use |
|--------|---------|-------------|
| **`dev`** | `nest start --watch` | Local API (default port **3031** via `PORT`) |
| **`build`** | `nest build` | Production compile → `dist/` |
| **`start`** | `node dist/main.js` | Run compiled app |
| **`start:debug`** | `nest start --debug --watch` | Debug + watch |
| **`typecheck`** | `tsc --noEmit` | CI / pre-PR type check |

```bash
pnpm --filter nest-clerk-api dev
pnpm --filter nest-clerk-api build
pnpm --filter nest-clerk-api start
pnpm --filter nest-clerk-api typecheck
```

### Tests

| Script | Command | When to use |
|--------|---------|-------------|
| **`test`** | `jest` | Unit tests (e.g. `drizzle.mock` without live Neon) |
| **`test:watch`** | `jest --watch` | Watch mode |

```bash
pnpm --filter nest-clerk-api test
pnpm --filter nest-clerk-api test:watch
```

### Maintenance

| Script | Command | When to use |
|--------|---------|-------------|
| **`clean`** | `git clean -xdf .cache .turbo dist node_modules` | Nuclear reset of app artifacts (use carefully) |

---

## Runtime wiring (NestJS)

### 1. `schema.ts`

- Define tables with `pgTable` from `drizzle-orm/pg-core`.
- Export a single **`schema`** object — required for relational queries and for `drizzle({ schema })`.

```ts
export const schema = { users };
```

### 2. `drizzle.ts`

- `createNeonDrizzle(databaseUrl)` → `{ sql, db }`.
- Export symbols **`DRIZZLE`** and **`NEON_SQL`** for injection.
- Export type **`DrizzleDb`** = `NeonHttpDatabase<typeof schema>`.

### 3. `database.module.ts`

- Load `dotenv` before reading `DATABASE_URL`.
- Call `createNeonDrizzle` once at module load.
- Register providers:

```ts
{ provide: DRIZZLE, useValue: db }
{ provide: NEON_SQL, useValue: sql }
```

- Mark module **`@Global()`** so feature modules inject `DRIZZLE` without re-importing.

### 4. Inject in services

```ts
import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DRIZZLE, type DrizzleDb } from "../database/drizzle";
import { users } from "../database/schema";

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  findByClerkId(clerkUserId: string) {
    return this.db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });
  }
}
```

Requires `schema` to include `users` and `drizzle({ client, schema })` to be used when creating `db`.

---

## `drizzle.config.ts`

Kit entry point (already present):

| Option | Value |
|--------|--------|
| `schema` | `./src/database/schema.ts` |
| `out` | `./drizzle` |
| `dialect` | `postgresql` |
| `dbCredentials.url` | `process.env.DATABASE_URL` |

Kit loads `.env` from `apps/nest-clerk-api/` before running. If `DATABASE_URL` is missing, commands exit with an explicit error.

---

## Common workflows

### Add or change a column / table

1. Edit `src/database/schema.ts`.
2. Dev: `pnpm --filter nest-clerk-api db:push`
3. Or: `db:generate` → review SQL in `drizzle/` → `db:migrate`.

### Verify connection without starting Nest

```bash
pnpm --filter nest-clerk-api db:studio
```

### Run API after schema is applied

```bash
pnpm --filter nest-clerk-api db:push
pnpm --filter nest-clerk-api dev
```

Hit `GET http://localhost:3031/health` (public route).

---

## Tests without Neon

`src/database/drizzle-neon.spec.ts` uses **`drizzle.mock({ schema })`** — no `DATABASE_URL` needed for that test. Jest setup may set a placeholder `DATABASE_URL` for other suites; see `apps/nest-clerk-api/test/jest.setup.ts`.

---

## Relationship to `apps/api`

| App | Package name | Drizzle schema | Notes |
|-----|--------------|----------------|--------|
| **`apps/nest-clerk-api`** | `nest-clerk-api` | `users` (+ future auth tables) | **This feature** |
| **`apps/api`** | `neon-jwt-api` | Full practice catalog | **Unchanged** by clerk-neon-auth; same script names (`db:push`, etc.) but **different filter** |

Do not mix filters:

```bash
pnpm --filter nest-clerk-api db:push   # auth DB / schema
pnpm --filter neon-jwt-api db:push     # practice catalog — separate app
```

Use the **same Neon project** or separate databases per environment — product decision; the specs do not require sharing one database.

---

## Acceptance criteria

- [ ] `DATABASE_URL` set in `apps/nest-clerk-api/.env`.
- [ ] `pnpm --filter nest-clerk-api db:push` succeeds and `users` exists in Neon.
- [ ] `schema.ts` exports `schema`; `drizzle.ts` exports `DRIZZLE` / `DrizzleDb`.
- [ ] `pnpm --filter nest-clerk-api dev` starts without DB connection errors.
- [ ] Team knows when to use `db:push` vs `db:generate` + `db:migrate`.

---

## Out of scope

- Clerk webhooks and JWT (Stages 3–4).
- Copying `apps/api` problem tables into `nest-clerk-api` (Stage 5 / future migration).
- Prisma or `pg` Pool adapter.
