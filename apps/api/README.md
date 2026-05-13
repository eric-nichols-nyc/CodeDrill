# CodeDrill API (`apps/api`)

NestJS service on **Neon Postgres** with **[Better Auth](https://www.better-auth.com/)** (email/password), **[@thallesp/nestjs-better-auth](https://github.com/ThallesP/nestjs-better-auth)**, and **Drizzle ORM** for the practice catalog (problems, submissions, chat threads, etc.).

Auth routes are mounted under `/api/auth/*`. Session cookies protect routes unless they use `@AllowAnonymous()` (see `ProblemsController` + `ProblemsAccessGuard` for the problems API).

The pnpm workspace package name is **`neon-jwt-api`**; the app lives in **`apps/api`**.

## Prerequisites

- Node.js 18+ (follow what your Nest / better-auth install resolves to)
- [pnpm](https://pnpm.io/) (monorepo uses `pnpm@10`)
- A [Neon](https://neon.tech/) Postgres database and `DATABASE_URL`

## Setup

### 1. Install dependencies

From the monorepo root:

```bash
pnpm install
```

### 2. Environment variables

Create **`apps/api/.env`** (see comments in `src/database/database.module.ts` and `src/auth.ts` for required variables). Typical values:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon Postgres connection string (Better Auth + Drizzle) |
| `BETTER_AUTH_SECRET` | At least 32 characters ([Better Auth installation](https://www.better-auth.com/docs/installation)) |
| `BETTER_AUTH_URL` | Public base URL of **this API** (e.g. `http://localhost:3030`). Must match what browsers and `curl` use. |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Comma-separated origins for CORS/cookies (e.g. Next app `http://localhost:3010`) |
| `INTERNAL_PROBLEMS_SECRET` | Optional shared secret; when set, `x-internal-problems-secret` can authorize `/problems` routes for server-to-server calls (Next admin BFF). |
| `PORT` | Optional; defaults to **3030** |

Generate a secret:

```bash
openssl rand -base64 32
```

### 3. Better Auth tables

Required before sign-up works.

```bash
pnpm --filter neon-jwt-api auth:migrate
```

Or generate SQL and run it in the Neon SQL editor:

```bash
pnpm --filter neon-jwt-api auth:generate
```

### 4. Practice catalog + chat tables (Drizzle)

Table definitions live in **`src/database/schema.ts`** (single file: tables + exported `schema` object for `drizzle({ schema })`).

Push schema to the database (development):

```bash
pnpm --filter neon-jwt-api db:push
```

Reference SQL for Neon is also under **`sql/practice-platform.sql`**.

## Run

From the monorepo root:

```bash
pnpm --filter neon-jwt-api dev
```

Or from `apps/api`:

```bash
pnpm dev
```

Default URL: `http://localhost:3030` (or your `PORT`).

## HTTP surface

### Better Auth

- `POST /api/auth/sign-up/email`, `POST /api/auth/sign-in/email`, session cookies, etc. ([basic usage](https://www.better-auth.com/docs/basic-usage))

### Session example

- **`GET /me`** — requires a valid Better Auth session cookie (`SessionController`).

### Problems catalog (`ProblemsController`)

Base path: **`/problems`**. Access: **Better Auth session** or **`x-internal-problems-secret`** when `INTERNAL_PROBLEMS_SECRET` is set (see `ProblemsAccessGuard`).

Examples: `GET /problems`, `GET /problems/by-slug/:slug`, `GET /problems/:id/details`, `POST /problems`, `PUT /problems/:id`.

### Problem chat (`ProblemChatController`)

Per-user tutor message history. **Session only** — no internal-secret bypass. `:problemId` is a **UUID** matching `problems.id`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/problems/:problemId/chat/messages` | Ensures a thread exists, returns `{ thread, messages }` (up to 500 messages, oldest first). |
| `POST` | `/problems/:problemId/chat/messages` | Body: `{ "content": string, "metadata"?: object }`. Appends a **`user`** row; assistant rows are intended to be written server-side when you add the LLM. |

Use **`@Session()`** / `session.user.id` for other user-scoped features ([NestJS + Better Auth](https://www.better-auth.com/docs/integrations/nestjs)).

## curl examples

```bash
export BASE=http://localhost:3030
```

`BASE` must match **`BETTER_AUTH_URL`**.

### Sign up

```bash
curl -X POST "$BASE/api/auth/sign-up/email" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Sign in (save cookies)

```bash
curl -X POST "$BASE/api/auth/sign-in/email" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### Protected route

```bash
curl "$BASE/me" -b cookies.txt
```

### List chat messages for a problem (after sign-in)

```bash
curl "$BASE/problems/00000000-0000-0000-0000-000000000001/chat/messages" -b cookies.txt
```

Replace the UUID with a real `problems.id` from your database.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Nest watch mode |
| `pnpm build` | Compile to `dist/` |
| `pnpm start` | Run `node dist/main.js` |
| `pnpm test` | Jest |
| `pnpm auth:migrate` | Apply Better Auth schema via CLI |
| `pnpm auth:generate` | Emit Better Auth SQL for manual apply |
| `pnpm db:push` | Drizzle: push `schema.ts` to Postgres (`--strict`) |
| `pnpm db:generate` | Drizzle: generate SQL migrations |
| `pnpm db:migrate` | Drizzle: run migrations |
| `pnpm db:studio` | Drizzle Kit Studio |

## References

- [Better Auth — Installation](https://www.better-auth.com/docs/installation)
- [Better Auth — NestJS](https://www.better-auth.com/docs/integrations/nestjs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [nestjs-better-auth](https://github.com/ThallesP/nestjs-better-auth)
