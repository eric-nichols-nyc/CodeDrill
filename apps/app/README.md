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

### Auth pages (`/auth/[path]`)

Sign-in, sign-up, email OTP, and related flows use Neon’s **`AuthView`** (`app/auth/[path]/page.tsx`). Use **`/auth/sign-in`** and **`/auth/sign-up`** (and other paths your Neon project exposes). Sign out is available from the header **`UserButton`**.

`proxy.ts` sends unauthenticated visitors to **`/auth/sign-in`** when they hit **`/dashboard`** or **`/account/*`**.

### Server-Side Auth

Get the current session and user on the server:

```typescript
import { getNeonAuth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { session, user } = await getNeonAuth();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <div>Welcome</div>;
}
```

### Client-Side Auth

The auth client is available for client components:

```typescript
import { authClient } from "@/lib/auth/client";

// Use authClient methods in client components
```

### Auth Routes

- `/auth/sign-in` - Sign in page
- `/auth/sign-up` - Sign up page
- `/auth/[path]` - Other auth flows (handled by Neon Auth UI)
- `/account/[path]` - Account management pages
- `/dashboard` - Protected dashboard page

### API Routes

The app includes a catch-all auth API route at `/api/auth/[...path]` that handles all Neon Auth API requests.

## Related Packages

- `@neondatabase/neon-js` - Neon database and auth client
- `@neondatabase/neon-auth-next` - Neon Auth Next.js integration
- `@neondatabase/neon-auth-ui` - Neon Auth UI components
- `@repo/design-system` - Shared UI components
- `@repo/database` - Prisma database client
- `@repo/prisma-neon` - Neon database adapter
- `@repo/typescript-config` - TypeScript configuration

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Neon Auth Documentation](https://neon.tech/docs/auth)
- [Prisma Documentation](https://www.prisma.io/docs)

