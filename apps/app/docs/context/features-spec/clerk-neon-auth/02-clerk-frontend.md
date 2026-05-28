# Stage 2: Clerk frontend

**Status:** **Done** — shipped on branch `nest-clerk-stage2` in `apps/app`. `@repo/clerk` shared package is **out of scope** (separate feature).

**Goal:** Users sign up/sign in via Clerk in **`apps/app`**; the app sends Bearer JWTs to **`apps/nest-clerk-api`** (not `apps/api` for identity). Practice catalog and user-scoped **`apps/api`** calls keep the existing Better Auth proxy and Bearer cookie until a deliberate migration.

**Depends on:** [Stage 1 — Foundation](./01-foundation.md), [Stage 3 — Webhook provisioning](./03-webhook-provisioning.md) (recommended before real sign-up testing).

**Blocks:** [Stage 6 — Provisioning UX](./06-provisioning-ux.md).

---

## Scope

### Clerk in Next.js (`apps/app`)

- `@clerk/nextjs` in the root app shell (`ClerkProvider` in `app/layout.tsx`).
- **Route group** `app/(unauthenticated)/`:
  - `layout.tsx` — minimal shell (home link, centered main; no app nav).
  - `sign-in/[[...sign-in]]/page.tsx` — prebuilt `<SignIn />`.
  - `sign-up/[[...sign-up]]/page.tsx` — prebuilt `<SignUp />`.
- **Remove** legacy `app/auth/` (Better Auth form pages). Do not add routes under `/auth/*`.
- **`proxy.ts`** (Next.js 16): `clerkMiddleware` + `createRouteMatcher`; **`auth.protect()`** on `/account(.*)` and `/admin(.*)`.
- After sign-in/sign-up, default landing is **`/problems`** via Clerk env (`NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`). When the proxy redirects an anonymous user to sign-in, Clerk returns them to the URL they tried to open (`redirect_url`).

### Hybrid auth (Option A — this stage)

| Concern | Mechanism |
| -------- | ----------- |
| Sign-in UI, session, route guard | **Clerk** (`useAuth`, `auth()`, `getToken()`) |
| `nest-clerk-api` (`GET /api/me`, etc.) | Clerk Bearer via `lib/auth/nest-clerk-api.ts` |
| Catalog / progress / chat / admin BFF → **`apps/api`** | **Stage 7 (Path A)** — `apiAuthHeaders()` sends Clerk Bearer; `apps/api` verifies JWT (`resolvePracticeUserId`) |

See [07-practice-bff-migration.md](./07-practice-bff-migration.md).

### Environment (`apps/app`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client |
| `CLERK_SECRET_KEY` | Server Components / route handlers |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/problems` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/problems` |
| `NEST_CLERK_API_URL` | Server → `nest-clerk-api` (default `http://localhost:3031`) |
| `NEON_JWT_API_URL` | Unchanged — catalog / practice API (`apps/api`) |

### API client pattern (`nest-clerk-api`)

```ts
import { getNestClerkMe } from "@/lib/auth/nest-clerk-api";

const me = await getNestClerkMe(); // GET /api/me with Clerk Bearer
```

**Do not** send `userId` from the browser for authorization; identity comes from the JWT on the server.

### `lib/auth` and `features/auth`

- **Clerk:** `clerk-server.ts`, `nest-clerk-api.ts`, `nest-clerk-url.ts`.
- **Practice upstream:** `api-auth-headers.ts` → Clerk Bearer to **`apps/api`** (Stage 7).
- **Removed:** Custom sign-in/sign-up forms, `app/auth/`, `AuthSessionProvider`, `dev-auth-form-fill`, Better Auth cookie guard in `proxy.ts`.
- **Client hook:** `useApiAuth` wraps Clerk `useAuth()` / `useUser()`.

### Unchanged in this stage

- **`apps/api`** source — Better Auth remains the authority for practice BFF routes.
- **Practice problem fetches** — `NEON_JWT_API_URL` → `apps/api`.
- Neon `users` row creation (Stage 3 webhook), provisioning gate (Stage 6).

---

## Acceptance criteria

- [x] Unauthenticated user can complete Clerk sign-up on `/sign-up`.
- [x] After sign-in, redirect matches `NEXT_PUBLIC_CLERK_AFTER_*` (default `/problems`).
- [x] Anonymous user hitting `/account` or `/admin` is redirected to Clerk sign-in and can return to the original URL after auth.
- [x] Server `getToken()` returns a token when signed in.
- [x] Sample fetch to `nest-clerk-api` includes `Authorization: Bearer …` (`/account` → `getNestClerkMe()`).
- [x] Legacy `app/auth/` removed; routes live under `app/(unauthenticated)/`.

---

## Out of scope (follow-up spec)

- Replacing Better Auth on **`apps/api`** BFF routes — see **[07-practice-bff-migration.md](./07-practice-bff-migration.md)**.
- Provisioning gate UI (Stage 6).
- `@repo/clerk` package.

## Verified in dev

- `/account` → `getNestClerkMe()` returns provisioned **`user`** row (Stages 2 + 3).
- Practice BFF uses Clerk Bearer to `apps/api` (Stage 7 Path A) — verify tutor / progress / workspace in dev.
