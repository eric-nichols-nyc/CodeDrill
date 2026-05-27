# Feature: API auth consolidation (single source of truth)

## Goal

Replace the split **Neon Auth (frontend) + Better Auth (Nest API)** setup with **one auth authority on the Nest API**. Users sign up and sign in against the API; the app receives a **Bearer token** and sends it on protected requests. Remove the BFF bridge hacks (`INTERNAL_PROBLEMS_SECRET` + `x-user-id`, Neon cookie forwarding) that exist because the two systems do not share sessions or user ids.

## Reference

- [01-design-system.md](./01-design-system.md) — UI folder layout, SOLID, tokens.
- [00-index.md](./00-index.md) — feature registry.
- [07-problem-chat-ui.md](./07-problem-chat-ui.md) — current auth transport via `upstreamUserHeaders()` (to be replaced).
- `apps/app/docs/workspace-code-save-flow.md` — documents today’s BFF → Nest auth model.
- `apps/app/docs/prd.md` § auth alignment — product context.
- [Better Auth — Bearer plugin](https://www.better-auth.com/docs/plugins/bearer)
- [Better Auth — NestJS](https://www.better-auth.com/docs/integrations/nestjs)
- **`apps/api/README.md`** (Deploy) — production API URL, `BETTER_AUTH_*` on Render, `NEON_JWT_API_URL` on the Next host

## User story

As a learner, I want to sign up or sign in once and have all practice features (workspace code, progress, chat, catalog) recognize me, so that I am not blocked by mismatched auth systems between the Next app and the Nest API.

As a developer, I want a single user table and one session model, so that guards and BFF routes do not need shared secrets or impersonation headers.

---

## Problem statement (current state)

| Layer | Auth today | User store |
| ----- | ---------- | ---------- |
| **Next app** (`apps/app`) | Neon Auth via `NEON_AUTH_BASE_URL`, proxied at `/api/auth/[...path]` | Neon Auth / hosted Better Auth |
| **Nest API** (`apps/api`) | Self-hosted Better Auth via `@thallesp/nestjs-better-auth` | API Postgres (`user`, `session` tables) |

When a user signs up on the frontend, the API **does not** create a corresponding user. Protected Nest routes only accept:

1. A **Better Auth session cookie** from the API itself, or
2. **`x-internal-problems-secret` + `x-user-id`** (BFF trusts Neon user id after verifying a shared secret).

This produces confusing failures, duplicate env vars, and fragile server-to-server impersonation.

### Files involved in today’s bridge (to retire or rewrite)

| Area | Path | Role today |
| ---- | ---- | ---------- |
| Neon Auth client | `apps/app/lib/auth/client.ts` | Frontend sign-in/up |
| Neon session (RSC) | `apps/app/lib/auth/server.ts` | `getNeonAuth()` |
| BFF user headers | `apps/app/lib/problems/upstream-user-headers.ts` | Secret + `x-user-id` + cookie forward |
| Neon proxy | `apps/app/app/api/auth/[...path]/route.ts` | Proxies to `NEON_AUTH_BASE_URL` |
| Auth UI | `apps/app/app/auth/[path]/page.tsx` | Neon `AuthView` |
| Route guard | `apps/app/proxy.ts` | Neon session cookie check |
| API user guard | `apps/api/src/problem-workspace-code/guards/problems-user.guard.ts` | Cookie **or** secret + `x-user-id` |
| API access guard | `apps/api/src/problems/guards/problems-access.guard.ts` | Cookie **or** secret |

---

## Target architecture

```
Browser / Next app                    Nest API (apps/api)
──────────────────                    ────────────────────
POST /api/auth/sign-up/email    →     Better Auth creates user in Postgres
POST /api/auth/sign-in/email    →     Response includes Bearer token (bearer plugin)
GET  /problems/...              →     Authorization: Bearer <token>
                                      auth.api.getSession() validates token
                                      @Session() / guards resolve user.id
```

**Single source of truth:** `apps/api/src/auth.ts` + Better Auth tables in the API database.

**Token transport:** `Authorization: Bearer <session-token>` on client and BFF upstream calls. Optional later: httpOnly cookie BFF wrapper — out of scope for v1 unless needed for XSS hardening.

---

## Requirements

### API (`apps/api`)

- [x] Enable Better Auth **`bearer()`** plugin in `src/auth.ts`.
- [x] Keep existing `@thallesp/nestjs-better-auth` `AuthModule.forRoot({ auth })` — no custom sign-up/sign-in controllers needed; routes stay at `/api/auth/*`.
- [x] Ensure `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_TRUSTED_ORIGINS`, and `DATABASE_URL` are documented as the only auth env vars for user sessions.
- [x] Confirm `auth.api.getSession()` resolves Bearer tokens in all user-scoped guards (`ProblemsUserGuard`, `ProblemsAccessGuard`, problem-chat, progress, workspace-code).
- [x] Remove **`x-user-id` impersonation path** from guards once the app migrates (keep `INTERNAL_PROBLEMS_SECRET` only if a true server-only admin/BFF path still needs it — not for end-user identity).
- [x] Expose **`GET /me`** (existing `SessionController`) as the canonical “who am I” check with Bearer auth.

### Next app (`apps/app`)

- [x] Replace Neon Auth client with **Better Auth client** pointed at the API base URL (`NEON_JWT_API_URL` / `BETTER_AUTH_URL` — pick one env name and deprecate the other in docs).
- [x] Auth pages (`/auth/sign-in`, `/auth/sign-up`) call API auth endpoints; store token from `set-auth-token` response header (or documented Better Auth bearer flow).
- [x] Replace `getNeonAuth()` / `upstreamUserHeaders()` with helpers that attach `Authorization: Bearer <token>` for server-side upstream fetches.
- [x] Update BFF routes under `app/api/problems/...` and Server Actions (e.g. problem chat) to use Bearer auth instead of secret + `x-user-id`.
- [x] Update `proxy.ts` (dashboard/account) to check API session (Bearer or validated session via API `GET /me`) instead of Neon cookie names.
- [x] Remove Neon Auth packages and env vars: `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `NEON_AUTH_TEST_*`, Neon proxy route.
- [x] Update `.env.example`, `README.md`, and error codes (`NOT_SIGNED_IN`, `MISSING_INTERNAL_SECRET`, etc.) to reflect the new model.

### Shared / docs

- [x] Document sign-up, sign-in, and token usage in `apps/api/README.md` (curl + client examples).
- [ ] Update `prd.md` auth row (F6) when shipped.
- [x] Note in spec: **existing Neon Auth users must re-register** on the API (different user tables today).

---

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Auth config | `apps/api/src/auth.ts` | `betterAuth()` + `bearer()` plugin |
| Nest integration | `apps/api/src/app.module.ts` | `AuthModule.forRoot({ auth })` |
| Session example | `apps/api/src/session.controller.ts` | `GET /me` |
| User-scoped guards | `apps/api/src/**/guards/*.ts` | Bearer via `auth.api.getSession()` |
| Auth UI | `apps/app/app/auth/[path]/page.tsx` | Replace Neon `AuthView` with Better Auth–backed forms or client |
| Auth lib | `apps/app/lib/auth/` | Client, server session helpers, token storage |
| BFF | `apps/app/app/api/problems/**` | Forward Bearer, not `x-user-id` |
| Server Actions | e.g. `features/problem-workspace/chatbot/lib/` | Same Bearer transport |
| Database | `apps/api` Better Auth migrations | Existing `user` / `session` tables — no new schema unless bearer plugin requires it |

---

## API

### Endpoints (Better Auth — auto-mounted by nestjs-better-auth)

| Method | Path | Auth | Body | Response |
| ------ | ---- | ---- | ---- | -------- |
| `POST` | `/api/auth/sign-up/email` | None | `{ email, password, name }` | User + session; **`set-auth-token`** header when bearer plugin enabled |
| `POST` | `/api/auth/sign-in/email` | None | `{ email, password }` | Session; **`set-auth-token`** header |
| `POST` | `/api/auth/sign-out` | Bearer or cookie | — | Clears session |
| `GET` | `/api/auth/get-session` | Bearer or cookie | — | `{ session, user }` |
| `GET` | `/me` | Bearer or cookie | — | `{ user, session }` (Nest `SessionController`) |

All existing user-scoped Nest routes (`/problems/:id/workspace-code`, progress, chat, etc.) accept **Bearer token** once guards use `auth.api.getSession()` with the bearer plugin enabled.

### Types

```ts
/** Stored client-side after sign-in (Better Auth bearer plugin). */
type ApiAuthToken = string;

/** Attach to fetch / upstream calls. */
type ApiAuthHeaders = {
  Authorization: `Bearer ${ApiAuthToken}`;
};

/** Session shape from GET /me or get-session (loose until shared package exists). */
type ApiUserSession = {
  user: { id: string; email: string; name: string | null };
  session: { id: string; expiresAt: string };
};
```

---

## Proposed file structure

```txt
apps/app/lib/auth/
  client.ts              # createAuthClient(API_URL) — replace Neon client
  server.ts              # getApiSession() via Bearer from cookie/header or /me
  token.ts               # read/write token (cookie or header strategy — decide at impl)
  keys.ts                # drop NEON_AUTH_* ; keep API URL + optional admin secret
  api-auth-headers.ts    # replaces upstream-user-headers.ts for user-scoped calls

apps/app/features/auth/          # optional — if auth forms leave app/auth pages
  components/
    sign-in-form.tsx
    sign-up-form.tsx
  hooks/
    use-api-auth.ts              # signIn, signUp, signOut, useSession

apps/api/src/auth.ts             # add bearer() plugin only (no new module required)
```

Routes stay thin: `apps/app/app/auth/[path]/page.tsx` composes auth feature components.

---

## Component / module responsibilities

### `lib/auth/client.ts`

- Better Auth client targeting the Nest API origin.
- `onSuccess` handler stores token from `set-auth-token` response header.

### `lib/auth/api-auth-headers.ts` (replaces `upstream-user-headers.ts`)

- Resolves current Bearer token for server components, route handlers, and Server Actions.
- Returns `null` when unsigned (callers return `401 NOT_SIGNED_IN`).

### Auth pages (`app/auth/[path]/page.tsx`)

- Render sign-in / sign-up forms wired to API client.
- Redirect to `next` query param after success.

### Nest guards (no new controllers)

- Continue using `auth.api.getSession({ headers: fromNodeHeaders(...) })`.
- Drop `x-user-id` branch after migration.

---

## Migration plan

1. **API:** Add `bearer()` plugin; verify curl sign-in returns `set-auth-token`; verify `GET /me` with Bearer.
2. **App auth lib:** New Better Auth client + token storage; parallel path behind env flag optional.
3. **BFF / actions:** Switch one vertical slice first (e.g. workspace-code) to Bearer; confirm end-to-end.
4. **Remaining surfaces:** progress, chat, admin BFF, catalog fetches, proxy guard.
5. **Cleanup:** Remove Neon packages, proxy route, `x-user-id` guard branch, obsolete env vars and tests (`session-cookie.test.ts` → API session test).
6. **Docs:** README, `.env.example`, prd, progress tracker.

---

## Out of scope (this pass)

- Social / OAuth providers.
- Email verification flows (use Better Auth defaults unless product requires stricter rules).
- Refresh token rotation policy beyond Better Auth defaults.
- Shared `@repo/auth` package (can follow later).
- Migrating Neon Auth user records into API `user` table (users re-register).
- httpOnly cookie-only token storage (localStorage Bearer is acceptable for v1; document XSS considerations).

---

## Acceptance criteria

- [x] User can sign up and sign in via UI; account exists in API `user` table.
- [x] After sign-in, workspace code, progress, and chat work without `INTERNAL_PROBLEMS_SECRET` or `x-user-id`.
- [x] `GET /me` returns the same user id used by workspace-code and chat rows.
- [x] Unsigned requests to user-scoped routes return `401` with clear JSON error.
- [x] Neon Auth code paths removed from `apps/app` (packages, env, proxy route).
- [x] Spec registered in [00-index.md](./00-index.md).
- [x] `pnpm typecheck` passes for `apps/app` and `apps/api`.

---

## Implementation prompt for agents

Implement **API auth consolidation** per this spec. Do not add Neon Auth workarounds. The Nest API is the only auth authority: enable the Better Auth bearer plugin, replace Neon Auth in `apps/app` with a Better Auth client pointed at the API, and update all BFF routes and Server Actions to send `Authorization: Bearer <token>`. Remove `x-user-id` impersonation from API guards. Migrate one vertical slice (workspace-code) first, then progress, chat, admin, and catalog. Update `.env.example` and README on both apps. Do not ship until sign-up → sign-in → save workspace code works without `INTERNAL_PROBLEMS_SECRET`.
