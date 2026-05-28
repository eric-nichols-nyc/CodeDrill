# Stage 7 (app): Practice BFF → Clerk Bearer

**Status:** **In progress** — **Path A** (Clerk JWT on `apps/api` + Clerk Bearer from `apps/app` BFF).

**Chosen approach:** Path A — not Path B (`nest-clerk-api` proxy).

**Goal:** After Clerk sign-in, **all user-scoped practice features** work without a separate Better Auth `codedrill.auth_token` cookie. UI already gates on Clerk (`useApiAuth`); server BFF/actions must send the same identity upstream.

**Depends on:** [Stage 2 — Clerk frontend](./02-clerk-frontend.md) (**done**), [Stage 3 — Webhook provisioning](./03-webhook-provisioning.md) (**done**).

**Does not replace:** Stages 4–5 on `nest-clerk-api` (guards / `*ForUser` on practice tables there). This stage is **`apps/app`** call sites + whichever upstream accepts Clerk JWT.

---

## Verified today (identity — not part of this stage)

Manual dev check (**passed**):

| Step | Result |
|------|--------|
| Clerk sign-in at `/sign-in` | Session in browser |
| `/account` protected by `proxy.ts` | Redirect when signed out |
| `GET /api/me` via `getNestClerkMe()` | Neon **`user`** row (`id` = Clerk `sub`) |
| Webhook provisioning | `user.created` / updates sync via `apps/nest-clerk-api/src/webhooks/webhooks.service.ts` |

Implementation: `apps/app/app/account/page.tsx`, `lib/auth/nest-clerk-api.ts`, `NEST_CLERK_API_URL`.

---

## Current split (hybrid Option A)

| Concern | Authority | App mechanism |
|---------|-----------|---------------|
| **Identity UI + `/account`** | Clerk + `nest-clerk-api` | `useApiAuth()`, `nestClerkAuthHeaders()`, `getNestClerkMe()` |
| **Practice BFF + catalog** | `apps/api` Better Auth | `apiAuthHeaders()` → `codedrill.auth_token` cookie; `/api/auth/*` proxy |

**Symptom:** User is signed in in the header (Clerk) but tutor chat, workspace save, or progress return `NOT_SIGNED_IN` / 401 — no Better Auth token was issued.

**Not Stage 3:** Webhook only creates the **`user`** row; it does not wire practice routes.

---

## Inventory — still on `apps/api` + Better Auth Bearer

### Next Route Handlers (`apps/app/app/api/`)

| Path | Auth helper | Upstream (`NEON_JWT_API_URL`) |
|------|-------------|-------------------------------|
| `problems/[problemId]/progress/route.ts` | `apiAuthHeaders()` | `GET/PUT …/progress` |
| `problems/[problemId]/workspace-code/route.ts` | `apiAuthHeaders()` | workspace-code |
| `problems/[problemId]/chat/stream/route.ts` | `apiAuthHeaders()` | chat stream |
| `admin/problems/route.ts` | `getApiAuth()` + `catalogUpstreamHeaders()` | `GET/POST /problems` |
| `admin/problems/[id]/route.ts` | `getApiAuth()` + `catalogUpstreamHeaders()` | problem CRUD |
| `admin/problems/generate/route.ts` | `getApiAuth()` + `catalogUpstreamHeaders()` | `POST /problems/generate` |
| `api/auth/[...path]/route.ts` | — | Better Auth proxy (remove last) |

### Server modules (`apps/app/`)

| Path | Auth helper | Notes |
|------|-------------|--------|
| `features/problem-workspace/chat-panel/lib/problem-chat-server.ts` | `apiAuthHeaders()` | threads, messages, send |
| `features/problem-workspace/chat-panel/lib/problem-chat-stream-server.ts` | via stream BFF | stream URL to `apps/api` |
| `lib/problems/fetch-problems-list.ts` | `catalogUpstreamHeaders()` | optional Bearer; may use internal secret |
| `lib/problems/fetch-problem-by-slug.ts` | `catalogUpstreamHeaders()` | same |
| `lib/auth/server.ts` | `apiAuthHeaders()` → `get-session` | legacy session for admin BFF checks |

### UI (Clerk only — no BFF change until server calls migrate)

| Path | Client gate |
|------|-------------|
| `features/auth/hooks/use-api-auth.ts` | Clerk |
| `features/auth/components/tutor-sign-in-prompt.tsx` | `/sign-in?redirect_url=…` |
| `features/problem-workspace/chat-panel/components/chat-shell.tsx` | `useApiAuth()` |

---

## Migration approaches

Pick one upstream strategy; the app changes are the same shape (`nestClerkAuthHeaders()` instead of `apiAuthHeaders()`).

### Path A — `apps/api` verifies Clerk JWT (**implemented**)

1. [x] `resolvePracticeUserId()` — Clerk `verifyToken` then Better Auth fallback (`apps/api/src/auth/resolve-practice-user-id.ts`).
2. [x] `ProblemsUserGuard` + `ProblemsAccessGuard` use resolver.
3. [x] `apiAuthHeaders()` → Clerk `auth().getToken()` (`apps/app/lib/auth/api-auth-headers.ts`).
4. [x] `getApiAuth()` → Clerk for admin BFF gates.
5. [x] Removed `/api/auth/*` proxy, `client.ts`, `token.ts`.

**Requires:** `CLERK_SECRET_KEY` (and optional `CLERK_AUTHORIZED_PARTIES`) on **`apps/api`** `.env` — same Clerk app as `apps/app`.

### Path B — User-scoped routes move to `nest-clerk-api`

1. Expose practice endpoints on `nest-clerk-api` (may overlap Stage 5).
2. Point BFF `fetch` base from `apiBaseUrl()` → `nestClerkApiBaseUrl()`.
3. Use `nestClerkAuthHeaders()` everywhere in the inventory table.
4. Leave public catalog on `apps/api` until migrated.

**Touches:** `apps/nest-clerk-api` + `apps/app` only for moved routes.

### Path C — Bridge (avoid)

Issue Better Auth session after Clerk sign-in server-side. Not recommended.

---

## Recommended implementation order

1. **Progress + workspace-code** — small BFF surface, easy to test on a problem page.
2. **Chat** — `problem-chat-server.ts` + stream route.
3. **Admin BFF** — replace `getApiAuth()` with Clerk `auth()`; keep `catalogUpstreamHeaders` strategy for internal secret if needed.
4. **Catalog fetchers** — optional Bearer from Clerk where user-scoped list behavior matters.
5. **Cleanup** — delete `app/api/auth/[...path]`, `client.ts`, `token.ts`, `getApiAuth()` if nothing references them.

---

## Acceptance criteria

- [ ] Signed-in Clerk user can save/load **workspace code** (manual verify).
- [ ] Signed-in Clerk user can read/write **problem progress** (manual verify).
- [ ] Signed-in Clerk user can use **tutor chat** (send + stream) (manual verify).
- [ ] **Admin** BFF routes work with Clerk session only (manual verify).
- [x] Unsigned user still gets `401` / `NOT_SIGNED_IN` on user-scoped BFF (unchanged BFF logic).
- [x] `/account` → `GET /api/me` still passes.
- [x] Better Auth proxy removed from `apps/app`; `apiAuthHeaders()` uses Clerk.

---

## Out of scope

- Changing Clerk UI or webhook (Stages 2–3).
- Stage 6 provisioning wait UI.
- Migrating **public** catalog reads if they work with internal secret only.
