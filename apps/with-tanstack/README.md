# with-tanstack

Boilerplate Next.js app with **@tanstack/react-query**, **Tailwind CSS**, and **better-auth**.

## Run

```bash
pnpm dev
```

App runs on [http://localhost:3021](http://localhost:3021).

## Setup

1. Copy `.env.example` to `.env.local`
2. Generate `BETTER_AUTH_SECRET`: `npx @better-auth/cli secret`
3. Ensure `DATABASE_URL` is set (from monorepo root or `packages/database`)
4. Run migrations: `pnpm migrate` (from monorepo root)

## Stack

- Next.js 16 (App Router)
- @tanstack/react-query
- better-auth (email/password)
- Tailwind CSS v4
- @repo/design-system (shadcn/ui)

## Auth

- `/sign-in` — sign in with email/password
- `/sign-up` — create account
- Session state via `useSession()` from better-auth client

## Example

The `/users` page demonstrates `useQuery` fetching from `/api/users` with loading, error, and refetch states.
