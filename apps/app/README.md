# Neon Auth - Next.js Application with Neon Database

A Next.js 16 application demonstrating authentication with Neon database integration using Neon Auth.

## Features

- **Neon Auth Integration** - Complete authentication system powered by Neon Auth
- **Auth UI** - Sign-in, sign-up, and other flows via Neon `AuthView` at `/auth/[path]`
- **Neon Database Integration** - Serverless PostgreSQL via `@repo/prisma-neon`
- **Prisma ORM** - Type-safe database access via `@repo/database` package
- **Theme Support** - Light/dark mode with `@repo/design-system`
- **Modern UI** - Built with Tailwind CSS, shadcn/ui components, and Neon Auth UI
- **Email OTP** - Email-based one-time password authentication
- **Protected Routes** - Server-side session management and route protection

## Project Structure

```
apps/neon-auth/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...path]/
│   │           └── route.ts  # Auth API route handler
│   ├── auth/
│   │   └── [path]/
│   │       └── page.tsx      # Auth pages (sign-in, sign-up, etc.)
│   ├── account/
│   │   └── [path]/
│   │       └── page.tsx      # Account management pages
│   ├── dashboard/
│   │   └── page.tsx         # Protected dashboard page
│   ├── layout.tsx           # Root layout with NeonAuthUIProvider
│   ├── page.tsx             # Home page
│   └── styles.css           # Global styles
├── lib/
│   └── auth/
│       ├── client.ts        # Client-side auth client
│       ├── keys.ts          # Env validation (NEON_AUTH_BASE_URL, etc.)
│       ├── server.ts        # getNeonAuth / getSession for RSC
│       └── session-cookie.ts # Cookie check for proxy.ts
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
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

Auth is owned by the **Nest API** (`apps/api`, Better Auth). The Next app proxies `/api/auth/*` to the API and stores a Bearer token in the `codedrill.auth_token` cookie after sign-in.

- **`/auth/sign-in`**, **`/auth/sign-up`** — email/password forms (`features/auth/`)
- **`/account`** — signed-in profile summary
- **`proxy.ts`** — redirects unsigned users from `/dashboard` and `/account`

### Server-side session

```typescript
import { getApiAuth } from "@/lib/auth/server";
import { apiAuthHeaders } from "@/lib/auth/api-auth-headers";

const { session, user } = await getApiAuth();
const headers = await apiAuthHeaders(); // Authorization: Bearer … for Nest upstream
```

See **`apps/api/README.md`** for curl sign-up/sign-in examples and **`docs/context/features-spec/08-api-auth-consolidation.md`** for the full auth model.

### Client-side

```typescript
import { authClient, signOutAndClearToken } from "@/lib/auth/client";
```

## Related Packages

- `better-auth` — auth client (sign-in/up against proxied API routes)
- `@repo/design-system` — Shared UI components
- `@repo/database` — Prisma database client
- `@repo/prisma-neon` — Neon database adapter
- `@repo/typescript-config` — TypeScript configuration

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Nest API README](../api/README.md)
- [Prisma Documentation](https://www.prisma.io/docs)

