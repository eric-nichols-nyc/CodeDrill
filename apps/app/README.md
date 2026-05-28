# CodeDrill — Next.js app (`apps/app`)

Next.js 16 UI for CodeDrill: problems workspace, admin, Clerk sign-in, and BFF routes to `apps/api` / `nest-clerk-api`.

## Features

- **Clerk auth** — Sign-in / sign-up at `/sign-in`, `/sign-up`; `proxy.ts` protects `/account` and `/admin`
- **Neon profile** — `GET /api/me` via `nest-clerk-api` with Clerk Bearer (`/account`)
- **Practice API (hybrid)** — Catalog and user-scoped BFF still use Better Auth on `apps/api` until migration
- **Theme** — Light/dark via `@repo/design-system`
- **Problem workspace** — Monaco, run, AI tutor chat (see `docs/`)

## Project Structure (auth)

```
apps/app/
├── app/
│   ├── (unauthenticated)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── account/page.tsx          # Clerk + GET /api/me
│   └── api/auth/[...path]/       # Better Auth proxy → apps/api
├── lib/auth/
│   ├── nest-clerk-api.ts         # Clerk Bearer → nest-clerk-api
│   ├── clerk-server.ts
│   ├── api-auth-headers.ts       # Better Auth Bearer → apps/api
│   └── client.ts                 # better-auth/react (BFF only)
└── proxy.ts                      # clerkMiddleware
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Neon database connection string
- Neon Auth base URL

### Installation

1. Install dependencies from the monorepo root:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   Create a `.env.local` file in the `apps/neon-auth` directory:
   ```env
   # Neon Auth Configuration
   NEON_AUTH_BASE_URL=your-neon-auth-base-url
   NEXT_PUBLIC_SITE_URL=http://localhost:3010
   ```

3. Run the development server:
   ```bash
   cd apps/neon-auth
   pnpm dev
   ```

4. Open [http://localhost:3010](http://localhost:3010)

## Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Unit tests (Vitest)
pnpm test
pnpm test:watch

# E2E tests (Playwright — installs browsers on first run: pnpm exec playwright install)
pnpm test:e2e
pnpm test:e2e:ui

# Clean build artifacts
pnpm clean
```

## Authentication

**Identity (Clerk):** Sign-in and sign-up at **`/sign-in`** and **`/sign-up`** (Clerk prebuilt UI under `app/(unauthenticated)/`). Session and route guards use **`proxy.ts`** + `clerkMiddleware` (protects `/account`, `/admin`). Profile from Neon via **`nest-clerk-api`**:

```typescript
import { getNestClerkMe } from "@/lib/auth/nest-clerk-api";

const me = await getNestClerkMe(); // GET /api/me with Clerk Bearer
```

**Practice BFF (`apps/api`, Better Auth):** Catalog, progress, chat, and admin BFF routes still proxy `/api/auth/*` and use `apiAuthHeaders()` from the `codedrill.auth_token` cookie until a deliberate migration. See **`docs/context/features-spec/clerk-neon-auth/02-clerk-frontend.md`** (Option A hybrid).

Env: copy **`apps/app/.env.example`** (Clerk keys, `NEST_CLERK_API_URL`, optional `NEON_JWT_API_URL`).

### Client-side (UI session)

```typescript
import { useApiAuth } from "@/features/auth/hooks/use-api-auth";
```

## Related Packages

- `@clerk/nextjs` — sign-in UI and session
- `better-auth` — practice BFF token client (proxied `/api/auth/*`)
- `@repo/design-system` — Shared UI components

## Resources

- [Clerk Next.js](https://clerk.com/docs/quickstarts/nextjs)
- [Better Auth](https://www.better-auth.com/docs) — `apps/api` practice routes
- [Nest API README](../api/README.md)
- Feature specs: `docs/context/features-spec/clerk-neon-auth/`

