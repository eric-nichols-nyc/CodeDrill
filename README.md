# CodeDrill

**CodeDrill** is a modern coding practice platform — a LeetCode-style environment for discovering problems, writing code in a workspace, validating against sample tests, and tracking progress. The product UI lives in **`apps/app`** (Next.js); the practice catalog, auth, and chat APIs live in **`apps/api`** (NestJS + Drizzle on Neon Postgres).

This monorepo is built on a [next-forge](https://github.com/vercel/next-forge) / Turborepo foundation. Product requirements, feature specs, and agent context are maintained under [`apps/app/docs/`](apps/app/docs/).

---

## Monorepo at a glance

| Path | Role | Dev port |
|------|------|----------|
| **`apps/app`** | CodeDrill UI — marketing, problems catalog, workspace, admin, in-app docs | **3010** |
| **`apps/api`** | Practice API — problems CRUD, submissions schema, AI tutor chat, progress | **3030** |
| **`apps/interview`** | AI Interview Coach (separate product zone) | 3012 |
| **`packages/design-system`** | Shared shadcn/ui primitives (`@repo/design-system`) | — |

**Tooling:** pnpm workspaces, Turborepo, TypeScript 5.9, Biome/Ultracite, Vitest, Playwright (e2e in `apps/app`).

---

## `apps/app` — where CodeDrill lives

The Next.js app in **`apps/app`** is the primary product surface. Package name is historically `neon-auth`; the product-facing name is **CodeDrill**.

### What it does

CodeDrill preserves the core practice loop:

1. **Discover** — browse and filter problems by difficulty, tags, and patterns
2. **Read** — open a problem statement with examples, hints, editorial, and optional visualizers
3. **Code** — edit starter code in Monaco with syntax highlighting
4. **Run** — execute against **visible sample tests** in the browser (structured feedback per case)
5. **Submit** — *(planned)* full test suite via server-side / sandboxed judge
6. **Track** — progress and chat history tied to signed-in users *(schema ready; wiring in flight)*

An **AI tutor chat** per problem supports streaming assistant replies, multi-thread sessions, starter suggestions, and sign-in gating.

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing page |
| `/problems` | Problem catalog with search, filters, sort, and section grouping |
| `/problems/[slug]` | Problem workspace — split layout: statement, editor, output, tutor chat |
| `/admin` | Admin catalog — template registry, added/not-added status, filters |
| `/admin/add` | Create or edit problems (AI-assisted form generation) |
| `/account` | Signed-in account (Clerk + profile via `nest-clerk-api`) |
| `/sign-in`, `/sign-up` | Clerk authentication |
| `/docs`, `/docs/[...slug]` | In-app documentation |
| `/dashboard` | Dashboard shell (template) |
| `/visualizer` | Standalone visualizer demos |

### Feature modules

UI is organized under **`apps/app/features/<name>/`** with `components/`, `hooks/`, `utils/`, and optional `queries/` or `lib/`. Routes in `apps/app/app/` stay thin.

| Feature | Path | Highlights |
|---------|------|------------|
| **landing** | `features/landing/` | Marketing sections, header, CTA |
| **problems-page** | `features/problems-page/` | Catalog table, toolbar, pagination, tag pills |
| **problem-workspace** | `features/problem-workspace/` | Split workspace shell, Monaco editor, Run, output panel, directions (description/hints/editorial), AI chat, step visualizers |
| **nav-drawer** | `features/nav-drawer/` | Left sheet problem list from workspace header |
| **problem-slug-nav** | `features/problem-slug-nav/` | Prev / next / random navigation in catalog order |
| **admin** | `features/admin/` | Problem CRUD, catalog filters, AI form generation, example images |
| **admin-chat-layout** | `features/admin-chat-layout/` | Admin Ask-AI slide-out panel |
| **auth** | `features/auth/` | Clerk provider, sign-in prompts for gated features |
| **problem-progress** | `features/problem-progress/` | Progress API client *(in progress)* |
| **docs** | `features/docs/` | Markdown docs renderer |

Shared app components (e.g. `split-layout`, timer) live in **`apps/app/components/`**. Data fetching and auth helpers live in **`apps/app/lib/`**.

### How the app talks to the API

Server Components fetch the catalog and problem detail from **`NEON_JWT_API_URL`** (default `http://localhost:3030`), forwarding cookies and optionally `x-internal-problems-secret` for admin BFF calls.

Next **Route Handlers** under `apps/app/app/api/` proxy to the Nest API for admin mutations, chat streaming, and authenticated practice endpoints. User-scoped calls send a **Clerk Bearer JWT** (`Authorization: Bearer <token>`).

See [`apps/api/README.md`](apps/api/README.md) for the full HTTP surface (problems CRUD, chat threads/messages/stream, progress).

### UI and design system

- **Framework:** Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Components:** `@repo/design-system` — shadcn/ui (New York style), semantic oklch tokens, light/dark via `next-themes`
- **Editor:** Monaco (`@monaco-editor/react`); CodeMirror also in dependencies
- **Data fetching:** TanStack Query for client chat/history; Server Components for catalog
- **AI chat:** AI SDK (`useChat`) + SSE streaming through BFF → Nest

Do **not** fork UI primitives under `apps/app/components/ui/`. Add components via:

```sh
npx shadcn@latest add <component> -c packages/design-system
```

Full UI conventions: [`apps/app/docs/context/ui-context.md`](apps/app/docs/context/ui-context.md).

### Current product state

| Area | Status |
|------|--------|
| Problem catalog from API | Shipped |
| Workspace (Monaco, split layout, Run on samples) | Shipped |
| AI tutor chat (streaming, multi-thread, starter suggestions) | Shipped (V1) |
| Admin catalog + create/edit + AI generation | Shipped / in progress |
| Problem visualizers (e.g. longest substring, spiral matrix) | Shipped |
| Example images on statements | Shipped (MVP — public folder paths) |
| Clerk auth + API Bearer integration | Shipped |
| **Submit** (full suite, server judge) | Not done — placeholder UI |
| **Progress** (solved/attempted in catalog) | Schema ready; end-to-end wiring TBD |
| Server-side judge service | Not implemented |

Primary bet: ship a trustworthy **run / submit** loop with isolated judging before heavy gamification.

Full requirements: [`apps/app/docs/prd.md`](apps/app/docs/prd.md).

---

## Getting started

### Prerequisites

- Node.js **24+**
- [pnpm](https://pnpm.io) 10
- Neon Postgres (`DATABASE_URL` for `apps/api`)
- [Clerk](https://clerk.com) application (same app for `apps/app` and `apps/api`)

### Run the CodeDrill stack

From the monorepo root:

```sh
pnpm install

# Practice API (port 3030)
pnpm --filter neon-jwt-api dev

# CodeDrill UI (port 3010) — separate terminal
pnpm --filter neon-auth dev

# Or both at once
pnpm dev:stack
```

Push the practice schema (first time):

```sh
pnpm --filter neon-jwt-api db:push
```

Open **http://localhost:3010**.

### Commands (`apps/app`)

```sh
pnpm dev          # http://localhost:3010
pnpm build
pnpm typecheck
pnpm test         # Vitest
pnpm test:e2e     # Playwright
```

API setup, env vars, and deploy notes: [`apps/api/README.md`](apps/api/README.md).

---

## Repository structure

```
codedrill/
├── apps/
│   ├── app/                  # CodeDrill UI (this is the product)
│   │   ├── app/              # App Router routes
│   │   ├── features/         # Domain UI modules
│   │   ├── components/       # Shared layout/components
│   │   ├── lib/              # Auth, API clients, fetchers
│   │   └── docs/             # PRD, specs, progress tracker
│   ├── api/                  # NestJS practice API
│   └── interview/            # AI Interview Coach (separate zone)
├── packages/
│   └── design-system/        # @repo/design-system
├── turbo.json
└── pnpm-workspace.yaml
```

### Architecture split

```
┌─────────────────────────────────────────────────────────┐
│  apps/app (Next.js, port 3010)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Server      │  │ Client       │  │ Route Handlers │  │
│  │ Components  │  │ workspace,   │  │ /api/admin/*   │  │
│  │ catalog     │  │ chat, admin  │  │ /api/problems/*│  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
└─────────┼────────────────┼──────────────────┼───────────┘
          │ HTTP + cookies │ Bearer JWT       │ proxy
          ▼                ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│  apps/api (NestJS, port 3030)                           │
│  Problems CRUD · Chat · Progress · Drizzle → Neon       │
└─────────────────────────────────────────────────────────┘
```

**Invariants:**

- Catalog and problem JSON live in **`apps/api`** + Postgres — not static maps in the Next app
- **Run** may stay client-side for sample tests; **Submit** must use a server/sandbox judge (not yet built)
- UI changes default to `apps/app`; judging and persistence logic belong in `apps/api`

Environments: local app `3010`, API `3030`; set `NEON_JWT_API_URL` in deployed app env. Details: [`apps/app/docs/context/architecture.md`](apps/app/docs/context/architecture.md).

---

## Documentation map

All product docs live under **`apps/app/docs/`**.

| Doc | Description |
|-----|-------------|
| [`apps/app/docs/prd.md`](apps/app/docs/prd.md) | Living product requirements — goals, phases, parity checklist |
| [`apps/app/docs/AGENTS.md`](apps/app/docs/AGENTS.md) | Agent/developer entry point, read order, commands |
| [`apps/app/docs/context/progress-tracker.md`](apps/app/docs/context/progress-tracker.md) | Current phase, shipped work, next up |
| [`apps/app/docs/context/features-spec/00-index.md`](apps/app/docs/context/features-spec/00-index.md) | Feature spec registry (admin, workspace, chat, auth, …) |
| [`apps/app/docs/context/ui-context.md`](apps/app/docs/context/ui-context.md) | Design tokens, typography, component conventions |
| [`apps/app/docs/context/architecture.md`](apps/app/docs/context/architecture.md) | Environments, stack, boundaries |
| [`apps/app/docs/problems-list-filtering.md`](apps/app/docs/problems-list-filtering.md) | Catalog toolbar, filters, zebra table |
| [`apps/app/docs/workspace-code-save-flow.md`](apps/app/docs/workspace-code-save-flow.md) | Editor persistence on Run |
| [`apps/app/docs/reference/`](apps/app/docs/reference/) | TanStack Query, React context, agent rules |
| [`apps/api/README.md`](apps/api/README.md) | API setup, Drizzle schema, HTTP routes, deploy |
| [`AGENTS.md`](AGENTS.md) | Monorepo agent scope and read-first paths |

### Feature spec highlights

Registered specs (see full index for status):

- **01** — Design system & feature folder structure
- **04** — Problems page list UI
- **05** — Admin catalog and filters
- **06 / 12** — Nav drawer and list UI parity
- **07 / 09 / 10 / 13** — Problem chat UI, streaming, message UI, starter suggestions
- **11 / 16** — Workspace refactor and state management
- **12** — AI problem form generation
- **14 / clerk-neon-auth/** — Clerk auth and BFF migration
- **15** — Problem visualizers
- **17** — Example images on statements

---

## Development conventions

- **Spec-driven:** Do not invent product behavior missing from `prd.md` or feature specs
- **Server Components first:** Add `"use client"` only for browser APIs and interactivity
- **Feature colocation:** `features/<name>/{components,hooks,utils}` — see [`01-design-system.md`](apps/app/docs/context/features-spec/01-design-system.md)
- **Thin routes:** Business logic stays in features, not `app/` route files
- **Progress tracker:** Update [`progress-tracker.md`](apps/app/docs/context/progress-tracker.md) after meaningful changes

For AI agents working in this repo, start with [`AGENTS.md`](AGENTS.md) → [`apps/app/AGENTS.md`](apps/app/AGENTS.md) → [`apps/app/docs/AGENTS.md`](apps/app/docs/AGENTS.md).

---

## Roadmap (high level)

| Phase | Scope | Status |
|-------|--------|--------|
| 0 | Tooling (Turborepo, Biome, Vitest, TS strict) | Done |
| 1 | UI shell + catalog from real API | Largely done |
| 2 | Drizzle schema, Nest problems API, admin, chat persistence | In progress |
| 3 | Judge service + submit pipeline + workspace Submit | Not started |
| 4 | Progress sync, polish, accessibility | Not started |
| 5 | P1 items (collections, streaks, hints polish) | Future |

---

## License

MIT (inherits next-forge template licensing where applicable)
