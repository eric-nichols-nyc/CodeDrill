# CodeDrill API (`apps/api`)

NestJS service on **Neon Postgres** with **[Better Auth](https://www.better-auth.com/)** (email/password), **[@thallesp/nestjs-better-auth](https://github.com/ThallesP/nestjs-better-auth)**, and **Drizzle ORM** for the practice catalog (problems, submissions, chat threads, etc.).

Auth routes are mounted under `/api/auth/*`. Protected routes accept a **Bearer token** (bearer plugin) or Better Auth session cookie unless they use `@AllowAnonymous()` with a custom guard (see `ProblemsController` + `ProblemsAccessGuard`).

The pnpm workspace package name is **`neon-jwt-api`**; the app lives in **`apps/api`**.

## Prerequisites

- Node.js **22.12+** (required for ESM-only deps: `@thallesp/nestjs-better-auth`, `better-auth`; see [Vercel](#vercel))
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
| `INTERNAL_PROBLEMS_SECRET` | Optional; when set, `x-internal-problems-secret` authorizes **catalog** `/problems` routes for server-to-server BFF (admin). Not used for end-user identity. |
| `PORT` | Optional; defaults to **3030** |

User session auth uses only the `BETTER_AUTH_*` and `DATABASE_URL` variables above. Clients send `Authorization: Bearer <token>` after sign-in (see [Bearer plugin](https://www.better-auth.com/docs/plugins/bearer)).

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

- `POST /api/auth/sign-up/email`, `POST /api/auth/sign-in/email`, session cookies, Bearer tokens ([basic usage](https://www.better-auth.com/docs/basic-usage), [bearer plugin](https://www.better-auth.com/docs/plugins/bearer))

### Session example

- **`GET /me`** — requires Bearer token or session cookie (`SessionController`).

### Problems catalog (`ProblemsController`)

Base path: **`/problems`**. Access: **Bearer token / session cookie** or **`x-internal-problems-secret`** when `INTERNAL_PROBLEMS_SECRET` is set for server-to-server catalog calls (see `ProblemsAccessGuard`).

Examples: `GET /problems`, `GET /problems/by-slug/:slug`, `GET /problems/:id/details`, `POST /problems`, `PUT /problems/:id`.

### Problem chat (`ProblemChatController`)

Per-user tutor message history. **Bearer token or session cookie** — no internal-secret bypass. `:problemId` is a **UUID** matching `problems.id`.

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
  -c cookies.txt -D sign-in-headers.txt
```

### Sign in (Bearer token)

After sign-in, Better Auth returns a token in the **`set-auth-token`** response header (bearer plugin):

```bash
TOKEN=$(grep -i '^set-auth-token:' sign-in-headers.txt | cut -d' ' -f2- | tr -d '\r')
echo "$TOKEN"
```

Or capture in one step:

```bash
TOKEN=$(
  curl -s -D - -o /dev/null -X POST "$BASE/api/auth/sign-in/email" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}' \
  | grep -i '^set-auth-token:' | cut -d' ' -f2- | tr -d '\r'
)
```

### Protected route (cookie)

```bash
curl "$BASE/me" -b cookies.txt
```

### Protected route (Bearer)

```bash
curl "$BASE/me" -H "Authorization: Bearer $TOKEN"
```

### List chat messages for a problem (after sign-in)

```bash
curl "$BASE/problems/00000000-0000-0000-0000-000000000001/chat/messages" \
  -H "Authorization: Bearer $TOKEN"
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

## Vercel

1. Set the Vercel project **Root Directory** to `apps/api`.
2. Set **Node.js Version** to **22.x** in Project Settings → General (must be ≥ 22.12 for `require(esm)`).
3. **Framework Preset** → Other. **Output Directory** → `public` (or leave blank if the dashboard allows it).
4. `vercel.json` runs `pnpm build` (webpack bundles ESM auth deps into `dist/serverless.js`), sets `outputDirectory` to `public`, and routes all traffic to `api/index.ts` → `dist/serverless.js`.

Do **not** point Vercel at `src/` — that compiles to CJS `require()` and breaks `@thallesp/nestjs-better-auth` (ESM-only). Set Node.js to **22.x** in the dashboard as a backup.

## References

- [Better Auth — Bearer plugin](https://www.better-auth.com/docs/plugins/bearer)
- [Better Auth — Installation](https://www.better-auth.com/docs/installation)
- [Better Auth — NestJS](https://www.better-auth.com/docs/integrations/nestjs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [nestjs-better-auth](https://github.com/ThallesP/nestjs-better-auth)
