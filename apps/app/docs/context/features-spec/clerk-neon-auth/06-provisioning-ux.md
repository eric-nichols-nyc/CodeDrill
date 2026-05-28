# Stage 6: Provisioning UX

**Status:** **Deferred** — implement after Stages 1, 3, 4 (and optionally 2) in `apps/nest-clerk-api`.

**Goal:** After Clerk sign-in, users do not see a broken app shell while the webhook syncs; they get a clear wait state with retry and sign-out.

**Depends on:** [Stage 2 — Clerk frontend](./02-clerk-frontend.md) (when scheduled), [Stage 4 — API authentication](./04-api-authentication.md), [Stage 3 — Webhook provisioning](./03-webhook-provisioning.md).

**Blocks:** Nothing.

---

## Scope (planned — `apps/app`)

### Gate before protected app chrome

1. Call **`GET ${NEST_CLERK_API_URL}/api/me`** with Clerk Bearer token.
2. Map outcomes:

| API result | UI state |
|------------|----------|
| 200 + user body | Render app shell + children |
| 404 | `provisioning` — no **`user`** row yet (webhook delay) |
| 401 | Redirect to sign-in |
| Network / 5xx / missing API URL | `error` with short `detail` |

**No workspace check** — CodeDrill does not have `GET /workspaces/mine`. Provisioning complete means **`GET /api/me` returns 200**.

### `ProvisionWait` component (name TBD)

- **`provisioning`:** “Setting up your account” — Retry (`router.refresh`); Sign out → `/sign-in`.
- **`error`:** connection/server message; optional `detail`; reload button.

### Where gate runs

- Protected route group (e.g. `/problems/*`, workspace) — not marketing or `/sign-in`.

### Middleware alignment

- Signed-in user may redirect `/` → `/problems`; gate handles DB-not-ready.

---

## Acceptance criteria (when implemented)

- [ ] New sign-up → protected route → provisioning UI, not broken layout.
- [ ] After webhook, Retry or refresh shows normal shell.
- [ ] Sign out clears Clerk session.
- [ ] Bad `NEST_CLERK_API_URL` or stopped API shows error variant.
- [ ] Gate does not flash nested 404s under the shell.

---

## User-facing copy (suggested)

**Provisioning title:** Setting up your account  
**Provisioning body:** Your account is still syncing. This usually takes a few seconds after sign-in. You can retry, or sign out and try again.

**Error title:** Couldn’t connect to the server  
**Error body:** We couldn’t reach the API or finish setup. Check your connection and try again.

---

## Out of scope

- Webhook implementation (Stage 3).
- Drizzle authorization rules (Stage 5).
- `apps/api` changes.
