# Stage 7 (app): Practice BFF → Clerk Bearer

**Status:** **Not started** — identity path is verified; practice routes still use Better Auth on `apps/api`.

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

### Path A — `apps/api` verifies Clerk JWT

1. Add Clerk JWT verification to `apps/api` guards (or shared middleware).
2. Replace `apiAuthHeaders()` with Clerk Bearer from `auth().getToken()` in listed files.
3. Keep `NEON_JWT_API_URL` and route paths unchanged.
4. Remove `/api/auth/*` proxy and `lib/auth/client.ts` / `token.ts` when unused.

**Touches:** `apps/api` source (explicitly out of scope for Stages 0–3; required here).

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

- [ ] Signed-in Clerk user can save/load **workspace code** without `codedrill.auth_token`.
- [ ] Signed-in Clerk user can read/write **problem progress**.
- [ ] Signed-in Clerk user can use **tutor chat** (send + stream) without Better Auth sign-in.
- [ ] **Admin** BFF routes work with Clerk session only (or documented internal-secret-only paths).
- [ ] Unsigned user still gets `401` / `NOT_SIGNED_IN` on user-scoped BFF (no regression).
- [ ] `/account` → `GET /api/me` still passes (regression check for Stages 2–3).
- [ ] Better Auth proxy removed or documented as dev-only legacy.

---

## Out of scope

- Changing Clerk UI or webhook (Stages 2–3).
- Stage 6 provisioning wait UI.
- Migrating **public** catalog reads if they work with internal secret only.
