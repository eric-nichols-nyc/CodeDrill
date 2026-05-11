# neon-jwt-api

NestJS API on Neon Postgres with **[Better Auth](https://www.better-auth.com/)** (email/password) and **[@thallesp/nestjs-better-auth](https://github.com/ThallesP/nestjs-better-auth)**. Auth routes live under `/api/auth/*`; session cookies protect everything else unless a route is marked `@AllowAnonymous()`.

## Prerequisites

- Node.js 18+ (nestjs-better-auth’s package may recommend Node 22+; use the version your install resolves to)
- [pnpm](https://pnpm.io/) (monorepo uses `pnpm@10`)
- A [Neon](https://neon.tech/) Postgres database and connection string

## Setup

### 1. Install dependencies

From the monorepo root:

```bash
pnpm install
```

### 2. Environment variables

Copy `.env.example` to `.env` in **this directory** (`apps/neon-jwt-api/`) and fill in values:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon Postgres connection string |
| `BETTER_AUTH_SECRET` | At least 32 characters; used by Better Auth ([docs](https://www.better-auth.com/docs/installation)) |
| `BETTER_AUTH_URL` | Public base URL of **this API** (e.g. `http://localhost:3030`). Must match what clients and curl use. |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Comma-separated browser origins allowed for CORS/cookies (e.g. your Next app at `http://localhost:3010`) |
| `PORT` | Optional; defaults to **3030** |

Generate a secret:

```bash
openssl rand -base64 32
```

### 3. Database schema (Better Auth tables)

Required before sign-up works.

**Option A — CLI migrate** (from `apps/neon-jwt-api`):

```bash
pnpm auth:migrate
```

**Option B — SQL in Neon**

If migrate is awkward in your environment, generate SQL and run it in the Neon SQL editor:

```bash
pnpm auth:generate
```

Then execute the generated file under `better-auth_migrations/` (or the path the CLI prints) once against the same database as `DATABASE_URL`.

## Run

From the monorepo root:

```bash
pnpm --filter neon-jwt-api dev
```

Or from `apps/neon-jwt-api`:

```bash
pnpm dev
```

Default URL: `http://localhost:3030` (or your `PORT`).

## What’s in the app

- **Better Auth** — `POST /api/auth/sign-up/email`, `POST /api/auth/sign-in/email`, session cookies, etc. ([basic usage](https://www.better-auth.com/docs/basic-usage))
- **`GET /`** — public (`@AllowAnonymous()`)
- **`GET /me`** — requires a valid session cookie (example protected route)

## curl examples

Set a base URL so you can swap host/port easily:

```bash
export BASE=http://localhost:3030
```

Ensure `BASE` matches **`BETTER_AUTH_URL`** in `.env`.

### Sign up (email + password)

```bash
curl -X POST "$BASE/api/auth/sign-up/email" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

Password must meet Better Auth’s minimum length (often 8+ characters).

### Sign in and save session cookie

```bash
curl -X POST "$BASE/api/auth/sign-in/email" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### Call a protected route

```bash
curl "$BASE/me" -b cookies.txt
```

### Sign out (Better Auth)

```bash
curl -X POST "$BASE/api/auth/sign-out" \
  -b cookies.txt \
  -c cookies.txt
```

(Exact sign-out path follows your Better Auth version; if this returns 404, check [Better Auth API routes](https://www.better-auth.com/docs) or run `pnpm dlx auth@latest info --config src/auth.ts`.)

## Private API + database access

Use **`@Session()`** from `@thallesp/nestjs-better-auth` on controllers that should only run for logged-in users, and scope your own SQL to `session.user.id` (authorization is still your responsibility). See the [NestJS integration guide](https://www.better-auth.com/docs/integrations/nestjs).

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Nest watch mode |
| `pnpm build` | Compile to `dist/` |
| `pnpm start` | Run `node dist/main.js` |
| `pnpm auth:migrate` | Apply Better Auth schema via CLI |
| `pnpm auth:generate` | Emit SQL migration files for manual apply |

## References

- [Better Auth — Installation](https://www.better-auth.com/docs/installation)
- [Better Auth — CLI](https://www.better-auth.com/docs/concepts/cli)
- [Better Auth — PostgreSQL adapter](https://www.better-auth.com/docs/adapters/postgresql)
- [nestjs-better-auth](https://github.com/ThallesP/nestjs-better-auth)
