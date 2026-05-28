# Stage 2: Clerk frontend

**Status:** **Deferred** — backend stages (1, 3, 4, 5) ship first in `apps/nest-clerk-api`. `@repo/clerk` shared package is explicitly **out of scope** (separate feature).

**Goal (when scheduled):** Users sign up/sign in via Clerk in **`apps/app`**; the app sends Bearer JWTs to **`apps/nest-clerk-api`** (not `apps/api` for auth).

**Depends on:** [Stage 1 — Foundation](./01-foundation.md), [Stage 3 — Webhook provisioning](./03-webhook-provisioning.md) (recommended before real sign-up testing).

**Blocks:** [Stage 6 — Provisioning UX](./06-provisioning-ux.md).

---

## Scope (planned)

### Clerk in Next.js (`apps/app`)

- `@clerk/nextjs` in app shell (no `@repo/clerk` until that package exists).
- Routes: `/sign-up/[[...sign-up]]`, `/sign-in/[[...sign-in]]` with prebuilt `<SignUp />` / `<SignIn />`.
- Middleware: public marketing + auth routes; `auth.protect()` on app routes that need a session.

### Environment (`apps/app`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client |
| `CLERK_SECRET_KEY` | Server Components / route handlers |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | e.g. `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | e.g. `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | e.g. `/problems` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | e.g. `/problems` |
| `NEST_CLERK_API_URL` | Server → `nest-clerk-api` (default `http://localhost:3031`) |

### API client pattern

```ts
const { getToken } = await auth();
const token = await getToken();
if (!token) throw new Error("Not authenticated");

await fetch(`${process.env.NEST_CLERK_API_URL}/me`, {
  headers: { Authorization: `Bearer ${token}` },
  cache: "no-store",
});
```

**Do not** send `userId` from the browser for authorization; identity comes from the JWT on the server.

### Unchanged in this stage

- **`apps/api`** — Better Auth / catalog calls stay as-is until a deliberate migration.
- **Practice problem fetches** — continue using existing `NEON_JWT_API_URL` → `apps/api` until product merges APIs.

---

## Acceptance criteria (when implemented)

- [ ] Unauthenticated user can complete Clerk sign-up on `/sign-up`.
- [ ] After sign-in, redirect matches `NEXT_PUBLIC_CLERK_AFTER_*`.
- [ ] Protected app routes redirect anonymous users to sign-in.
- [ ] Server `getToken()` returns a token when signed in.
- [ ] Sample fetch to `nest-clerk-api` includes `Authorization: Bearer …`.

---

## Out of scope

- Neon `users` row creation (Stage 3 webhook).
- Nest guard / `GET /me` DB shape (Stage 4).
- Provisioning gate UI (Stage 6).
