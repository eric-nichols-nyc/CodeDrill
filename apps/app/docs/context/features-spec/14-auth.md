# Feature: auth (end-user sign-in and session)

## Goal

Document how **authentication** works in CodeDrill and enforce that **signed-in users only** can use the problem workspace **AI tutor chat**. The Nest API is the single source of truth for accounts and sessions; the Next app stores a Bearer token and forwards it on protected calls.

## Reference

- [01-design-system.md](./01-design-system.md) — feature UI layout.
- [00-index.md](./00-index.md) — feature registry.
- [08-api-auth-consolidation.md](./08-api-auth-consolidation.md) — migration / consolidation history (shipped).
- [07-problem-chat-ui.md](./ai/problem-chat/07-problem-chat-ui.md) — tutor chat (requires auth).
- `apps/app/README.md` — env and curl examples.

## User story

As a learner, I want to sign in once and stay recognized across practice features, so that my workspace code, progress, and tutor threads are tied to my account.

As a product owner, I want chat and other user-scoped APIs to reject anonymous use, so that tutor usage is attributable and persisted per user.

---

## How auth works (overview)

```
┌─────────────┐     POST /api/auth/sign-in/email      ┌──────────────────┐
│  Browser    │ ────────────────────────────────────► │  Next app BFF    │
│  (forms)    │     (proxied to Nest Better Auth)     │  app/api/auth/*  │
└─────────────┘                                       └────────┬─────────┘
       │                                                         │
       │  set-auth-token header + persistAuthToken()             ▼
       │  (cookie codedrill.auth_token + localStorage)   ┌──────────────────┐
       │                                                  │  Nest API        │
       │  Authorization: Bearer <token>                   │  Better Auth     │
       └────────────────────────────────────────────────► │  user + session  │
                                                          └──────────────────┘
```

| Step | What happens |
| ---- | -------------- |
| Sign up / sign in | `features/auth` forms call `authClient` → Next proxies to API Better Auth → response includes **`set-auth-token`** |
| Token storage | `lib/auth/token.ts` writes cookie (for middleware + server) and **localStorage** (for client Better Auth fetches) |
| Server Components / actions | `apiAuthHeaders()` reads cookie → `Authorization: Bearer …` on upstream Nest calls |
| Client session | `authClient.useSession()` hits `/api/auth/get-session` with Bearer from storage |
| Route guard | `proxy.ts` redirects `/problems/*` and `/account/*` to `/auth/sign-in?next=…` when auth cookie is missing |

**Authority:** `apps/api/src/auth.ts` (Better Auth + `bearer()` plugin). **Not** a separate Neon or frontend-only user table.

---

## Requirements

### Auth UI (`features/auth/`)

- [x] Sign-in and sign-up forms at `/auth/sign-in`, `/auth/sign-up`.
- [x] After success, redirect to `next` query param (default `/problems`).
- [x] `useApiAuth()` hook wraps `authClient.useSession()` for feature code.

### Protected routes (app)

- [x] `proxy.ts` requires `codedrill.auth_token` cookie for `/problems/:path*` and `/account/:path*`.
- [x] Unsigned BFF/chat/actions return `401` with code `NOT_SIGNED_IN`.

### AI tutor chat (must be signed in)

- [x] Chat panel checks client session before enabling send, suggestions, and thread controls.
- [x] Unsigned users see a **Sign in to use the tutor** empty state with link to `/auth/sign-in?next=<current path>`.
- [x] Stream BFF `POST /api/problems/:id/chat/stream` returns 401 when cookie/token missing (already enforced).

### User-scoped features (same token model)

- Workspace code save/load, problem progress, chat threads/messages — all use `apiAuthHeaders()` / Nest guards (Bearer).

---

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Auth config | `apps/api/src/auth.ts` | Better Auth + bearer plugin |
| Auth UI | `apps/app/features/auth/` | Forms, chat sign-in prompt, `useApiAuth` |
| Auth lib | `apps/app/lib/auth/` | Client, server session, token cookie, `apiAuthHeaders` |
| Auth routes | `apps/app/app/auth/[path]/page.tsx` | Thin pages composing auth forms |
| Auth proxy | `apps/app/app/api/auth/[...path]/route.ts` | Proxies Better Auth to API |
| Route guard | `apps/app/proxy.ts` | Cookie check for problems/account |
| Tutor chat | `features/problem-workspace/chat-panel/` | UI gate + existing server/BFF auth |

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

## Proposed file structure

```txt
apps/app/features/auth/
  components/
    sign-in-form.tsx
    sign-up-form.tsx
    tutor-sign-in-prompt.tsx   # chat empty state when unsigned
  hooks/
    use-api-auth.ts            # isSignedIn, isPending, session, user

apps/app/lib/auth/
  client.ts                    # better-auth/react client
  server.ts                    # getApiAuth() for RSC
  token.ts                     # cookie + localStorage
  api-auth-headers.ts          # server Bearer headers
  session-cookie.ts            # proxy guard helper
```

---

## Component responsibilities

### `useApiAuth`

- Exposes `isSignedIn`, `isPending`, `session`, `user` from `authClient.useSession()`.
- Use in client features that need gating (chat, optional banners).

### `TutorSignInPrompt`

- Shown in chat message area when `!isSignedIn`.
- Link: `/auth/sign-in?next=${encodeURIComponent(pathname + search)}`.

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

Read this spec before changing auth or tutor chat. Do not reintroduce Neon Auth or `x-user-id` BFF impersonation. For new user-scoped features, use `apiAuthHeaders()` on the server and `useApiAuth()` or `authClient.useSession()` on the client. Chat must remain signed-in only at UI and BFF/API layers.
