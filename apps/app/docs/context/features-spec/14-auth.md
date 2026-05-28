# Feature: auth (end-user sign-in and session)

## Goal

Document how **authentication** works in CodeDrill and enforce that **signed-in users only** can use the problem workspace **AI tutor chat**.

## Current model (hybrid — Clerk + Better Auth BFF)

| Layer | Authority | UI / session | Upstream token |
| ----- | --------- | ------------ | -------------- |
| **Identity** | Clerk + `nest-clerk-api` | `/sign-in`, `/sign-up`; `useApiAuth()` → Clerk | Clerk JWT → `GET /api/me` |
| **Practice BFF** | `apps/api` (Clerk JWT + legacy Better Auth fallback) | Same Clerk sign-in | `apiAuthHeaders()` → Clerk `getToken()` |

See [clerk-neon-auth/02-clerk-frontend.md](./clerk-neon-auth/02-clerk-frontend.md) (Stage 2 **done**) and [07-practice-bff-migration.md](./clerk-neon-auth/07-practice-bff-migration.md) (**next**). `/account` → `GET /api/me` verified in dev. Clerk-only users may 401 on progress/chat/workspace-code until Stage 7 migrates BFF call sites.

## Reference

- [01-design-system.md](./01-design-system.md) — feature UI layout.
- [00-index.md](./00-index.md) — feature registry.
- [08-api-auth-consolidation.md](./08-api-auth-consolidation.md) — Better Auth BFF history (shipped).
- [clerk-neon-auth/02-clerk-frontend.md](./clerk-neon-auth/02-clerk-frontend.md) — Clerk UI + `nest-clerk-api`.
- [07-problem-chat-ui.md](./ai/problem-chat/07-problem-chat-ui.md) — tutor chat (requires auth).
- `apps/app/README.md` — env setup.

## User story

As a learner, I want to sign in once and stay recognized across practice features, so that my workspace code, progress, and tutor threads are tied to my account.

As a product owner, I want chat and other user-scoped APIs to reject anonymous use, so that tutor usage is attributable and persisted per user.

---

## How auth works (overview)

**Clerk (identity UI + `nest-clerk-api`):**

```
Browser → Clerk (/sign-in, /sign-up) → session JWT
       → nest-clerk-api GET /api/me (Bearer from auth().getToken())
       → Neon user row (id = Clerk sub), when Stage 3 webhook has run
```

**Better Auth (practice BFF — until migration):**

```
Browser → /api/auth/* proxy → apps/api Better Auth → set-auth-token → codedrill.auth_token cookie
       → apiAuthHeaders() on BFF/actions → apps/api user-scoped routes
```

| Step | What happens |
| ---- | -------------- |
| Sign up / sign in | Clerk prebuilt UI at `/sign-up`, `/sign-in` |
| Client session (UI) | `useApiAuth()` wraps Clerk `useAuth()` / `useUser()` |
| Route guard | `proxy.ts` — `clerkMiddleware`; `auth.protect()` on `/account`, `/admin` |
| Neon profile | `getNestClerkMe()` on `/account` (server Bearer to `nest-clerk-api`) |
| Practice BFF | `apiAuthHeaders()` from Better Auth cookie → `apps/api` (unchanged) |

---

## Requirements

### Auth UI (`features/auth/` + `(unauthenticated)/`)

- [x] Clerk sign-in and sign-up at `/sign-in`, `/sign-up` (`app/(unauthenticated)/`).
- [x] After sign-in, redirect via `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` (default `/problems`).
- [x] `useApiAuth()` hook wraps Clerk for feature code.

### Protected routes (app)

- [x] `proxy.ts` — Clerk protects `/account/:path*` and `/admin/:path*`.
- [x] Unsigned BFF/chat/actions return `401` with code `NOT_SIGNED_IN` (Better Auth Bearer on `apps/api`).

### AI tutor chat (must be signed in)

- [x] Chat panel checks client session before enabling send, suggestions, and thread controls.
- [x] Unsigned users see a **Sign in to use the tutor** empty state with link to `/sign-in?redirect_url=<current path>`.
- [x] Stream BFF `POST /api/problems/:id/chat/stream` returns 401 when cookie/token missing (already enforced).

### User-scoped features (same token model)

- Workspace code save/load, problem progress, chat threads/messages — all use `apiAuthHeaders()` / Nest guards (Bearer).

---

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Clerk UI | `apps/app/app/(unauthenticated)/` | `<SignIn />`, `<SignUp />` |
| Identity API | `apps/nest-clerk-api/` | JWT guard, `GET /me` |
| Practice auth config | `apps/api/src/auth.ts` | Better Auth + bearer (BFF until migration) |
| Auth UI helpers | `apps/app/features/auth/` | `TutorSignInPrompt`, `useApiAuth` |
| Auth lib | `apps/app/lib/auth/` | Clerk + `nest-clerk-api.ts`; `apiAuthHeaders` for `apps/api` |
| Better Auth proxy | `apps/app/app/api/auth/[...path]/route.ts` | Proxies to `apps/api` |
| Route guard | `apps/app/proxy.ts` | `clerkMiddleware` — `/account`, `/admin` |
| Tutor chat | `features/problem-workspace/chat-panel/` | UI gate (Clerk) + BFF (Better Auth Bearer) |

---

## API (Better Auth on Nest — via Next proxy)

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| `POST` | `/api/auth/sign-up/email` | None | Create account |
| `POST` | `/api/auth/sign-in/email` | None | Session + `set-auth-token` |
| `POST` | `/api/auth/sign-out` | Bearer | End session |
| `GET` | `/api/auth/get-session` | Bearer | `{ session, user }` for UI |
| `GET` | `/me` | Bearer | Nest canonical session check |

User-scoped practice routes (`/problems/:id/chat/*`, workspace-code, progress) require **Bearer** resolved by `auth.api.getSession()`.

---

## File structure

```txt
apps/app/app/(unauthenticated)/
  layout.tsx
  sign-in/[[...sign-in]]/page.tsx
  sign-up/[[...sign-up]]/page.tsx

apps/app/features/auth/
  components/
    tutor-sign-in-prompt.tsx
  hooks/
    use-api-auth.ts            # Clerk useAuth / useUser

apps/app/lib/auth/
  clerk-server.ts              # auth(), currentUser()
  nest-clerk-api.ts            # getNestClerkMe(), fetchNestClerkApi()
  client.ts                    # better-auth/react (apps/api BFF only)
  server.ts                    # getApiAuth() for apps/api session
  token.ts                     # codedrill.auth_token cookie
  api-auth-headers.ts          # Bearer for apps/api upstream
```

---

## Component responsibilities

### `useApiAuth`

- Exposes `isSignedIn`, `isPending`, `session`, `user` from Clerk.
- Use in client features that need gating (chat, optional banners).

### `TutorSignInPrompt`

- Shown in chat message area when `!isSignedIn`.
- Link: `/sign-in?redirect_url=${encodeURIComponent(pathname + search)}`.

### `ChatShell`

- If auth pending → loading empty state.
- If unsigned → header (disabled actions) + prompt + disabled input.
- If signed in → existing tutor UX unchanged.

---

## Out of scope

- OAuth / social providers.
- httpOnly-only token storage (v1 uses cookie + localStorage; see 08 spec).
- Migrating legacy Neon users.
- Requiring auth for **read-only** marketing or public catalog pages.

---

## Acceptance criteria

- [x] Spec registered in [00-index.md](./00-index.md).
- [x] `14-auth.md` describes sign-in flow, token storage, and guard layers.
- [x] Unsigned user on problem page cannot send chat messages or start threads (UI + API).
- [x] Sign-in link returns user to the same problem after auth.
- [x] `pnpm typecheck` passes for `apps/app`.

## Implementation prompt for agents

Read this spec before changing auth or tutor chat. Do not reintroduce Neon Auth or `x-user-id` BFF impersonation. For **identity** and `nest-clerk-api`, use Clerk + `getNestClerkMe()` / `nestClerkAuthHeaders()`. For **practice BFF** (`apps/api`), use `apiAuthHeaders()` until migration. UI gates use `useApiAuth()` (Clerk). Chat must remain signed-in only at UI and BFF/API layers.
