# CodeDrill API (`apps/api`)

NestJS service on **Neon Postgres** with **[Clerk](https://clerk.com/)** auth (Bearer JWT verification via `@clerk/backend`) and **Drizzle ORM** for the practice catalog (problems, submissions, chat threads, etc.).

Protected routes verify a **Clerk session JWT** sent as `Authorization: Bearer <token>`. The token's `sub` claim is the practice user id (`user.id`, provisioned by the Clerk webhook on `apps/nest-clerk-api`). Server-to-server catalog calls may instead use `x-internal-problems-secret` (see `ProblemsController` + `ProblemsAccessGuard`).

> Identity concerns (sign-in/up UI, `GET /api/me` profile row, Clerk webhooks) live in **`apps/nest-clerk-api`**. This service only verifies the Clerk JWT to authorize practice features.

The pnpm workspace package name is **`neon-jwt-api`**; the app lives in **`apps/api`**.

## Prerequisites

- Node.js **24.x** (see `engines` in `package.json`)
- [pnpm](https://pnpm.io/) (monorepo uses `pnpm@10`)
- A [Neon](https://neon.tech/) Postgres database and `DATABASE_URL`
- A [Clerk](https://clerk.com/) application (same app as `apps/app`) and `CLERK_SECRET_KEY`

## Setup

### 1. Install dependencies

From the monorepo root:

```bash
pnpm install
```

### 2. Environment variables

Create **`apps/api/.env`** (see comments in `src/database/database.module.ts` for DB variables). Typical values:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon Postgres connection string (Drizzle) |
| `CLERK_SECRET_KEY` | Clerk secret (same app as `apps/app` / Dashboard). Verifies `Authorization: Bearer` JWT on protected routes (`sub` → `user.id`). |
| `CLERK_AUTHORIZED_PARTIES` | Optional; comma-separated origins for Clerk `verifyToken` (e.g. `http://localhost:3010`) |
| `INTERNAL_PROBLEMS_SECRET` | Optional; when set, `x-internal-problems-secret` authorizes **catalog** `/problems` routes for server-to-server BFF (admin). Not used for end-user identity. |
| `OPENAI_API_KEY` | Optional; required for problem generation + tutor chat completions. |
| `PORT` | Optional; defaults to **3030** |

User-scoped practice routes require a **Clerk Bearer** JWT. Catalog reads may use `x-internal-problems-secret` when configured.

### 3. Practice catalog + chat tables (Drizzle)

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

### Session example

- **`GET /me`** — requires a Clerk Bearer JWT (`SessionController`); returns `{ userId }`. The full profile row is served by `apps/nest-clerk-api` at `GET /api/me`.

### Problems catalog (`ProblemsController`)

Base path: **`/problems`**. **GET** (list, by slug, details) is **public** — returns published problems only unless the caller sends a Clerk Bearer JWT or matching `x-internal-problems-secret` (drafts / admin). **POST/PUT/generate** require auth (`ProblemsAccessGuard`).

Examples: `GET /problems`, `GET /problems/by-slug/:slug`, `GET /problems/:id/details`, `POST /problems`, `PUT /problems/:id`.

### Problem chat (`ProblemChatController`)

Per-user tutor message history. **Clerk Bearer JWT** — no internal-secret bypass. `:problemId` is a **UUID** matching `problems.id`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/problems/:problemId/chat/messages` | Ensures a thread exists, returns `{ thread, messages }` (up to 500 messages, oldest first). |
| `POST` | `/problems/:problemId/chat/messages` | Body: `{ "content": string, "metadata"?: object }`. Appends a **`user`** row; assistant rows are written server-side. |

The authenticated user id is resolved by `ProblemsUserGuard` → `resolvePracticeUserId()` (`request.userId`).

## curl examples

```bash
export BASE=http://localhost:3030
```

Get a Clerk session token from the signed-in `apps/app` (e.g. `await auth().getToken()` server-side, or the Clerk session in the browser), then:

### Session check (Bearer)

```bash
curl "$BASE/me" -H "Authorization: Bearer $TOKEN"
```

### List chat messages for a problem

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
| `pnpm db:push` | Drizzle: push `schema.ts` to Postgres (`--strict`) |
| `pnpm db:generate` | Drizzle: generate SQL migrations |
| `pnpm db:migrate` | Drizzle: run migrations |
| `pnpm db:studio` | Drizzle Kit Studio |

## Deploy

NestJS is a **long-running HTTP server** (`pnpm start` → `node dist/main.js`), which maps cleanly to a container/web service. Auth is now Clerk-only (no ESM-only dependencies), so the previous `ERR_REQUIRE_ESM` friction on serverless runtimes no longer applies.

### Render (free tier, good fit)

Repo root includes [`render.yaml`](../../render.yaml).

1. [render.com](https://render.com) → **New** → **Blueprint** → connect this repo.
2. Add env vars: `DATABASE_URL`, `CLERK_SECRET_KEY`, optional `CLERK_AUTHORIZED_PARTIES`, `OPENAI_API_KEY`, `INTERNAL_PROBLEMS_SECRET`.
3. In the Next app (Vercel/local), set `NEON_JWT_API_URL` to the API origin (see `apps/app/.env.example`).

**Manual setup (no Blueprint):** Web Service → Root Directory `.` → Build `pnpm install --frozen-lockfile && pnpm --filter neon-jwt-api build` → Start `node apps/api/dist/main.js`.

#### Free tier: cold starts and keep-alive ping

Render **free** services spin down after ~15 minutes with no traffic. The next request can take 30–90+ seconds (Nest cold start). Optionally point an external monitor ([UptimeRobot](https://uptimerobot.com) / [cron-job.org](https://cron-job.org)) at the service root every **10–14 minutes**. For production traffic, use a **paid** (always-on) instance.

### Other options

| Platform | Fit for Nest | Notes |
|----------|----------------|-------|
| [Render](https://render.com) | Excellent | Free web service; use config above |
| [Fly.io](https://fly.io) | Excellent | Free allowance; deploy via Dockerfile |
| [Railway](https://railway.app) | Excellent | Usage-based credits; simple `railway up` |
| [Koyeb](https://www.koyeb.com) | Good | Free nano instances |
| Vercel | OK | Detects Nest from `src/main.ts`; keep `vercel.json` minimal (monorepo install + `pnpm build`, no `functions`/`rewrites`). |

### Vercel (zero-config)

Vercel [detects Nest from `src/main.ts`](https://vercel.com/docs/frameworks/backend/nestjs) automatically. Do **not** set `framework: null`, add `api/index.ts`, or set `outputDirectory: public` — those override detection.

1. Project **Root Directory** → `apps/api`
2. `vercel.json` only sets monorepo install + `pnpm build` (no `functions` / `rewrites`)
3. Entrypoint stays `src/main.ts` (same as a normal Nest deploy)

## References

- [Clerk — Backend SDK (`@clerk/backend`)](https://clerk.com/docs/references/backend/overview)
- [Clerk — Verify a session token](https://clerk.com/docs/backend-requests/handling/manual-jwt)
- [Drizzle ORM](https://orm.drizzle.team/)
