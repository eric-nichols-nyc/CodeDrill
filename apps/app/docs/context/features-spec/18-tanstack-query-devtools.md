# Feature: TanStack Query devtools

## Goal

Wire the TanStack Query devtools panel into the existing `@tanstack/react-devtools` shell so developers can inspect client-side query cache entries (notes, chat, workspace code, progress) during local development.

## Reference

- [01-design-system.md](./01-design-system.md) — shared UI conventions (N/A for dev-only tooling).
- [07-problem-chat-ui.md](./ai/problem-chat/07-problem-chat-ui.md) — TanStack Query usage in problem workspace.
- [00-index.md](./00-index.md) — register this file.

## User story

As a developer, I want to inspect TanStack Query cache entries in the browser, so that I can debug server-state fetching, caching, and invalidation without logging.

## Requirements

### Devtools shell

- [x] Mount `@tanstack/react-devtools` only when `NODE_ENV === "development"`.
- [x] Register the Query plugin via `@tanstack/react-query-devtools` (`ReactQueryDevtoolsPanel`).
- [x] Keep the devtools component in a dedicated client module (root layout stays a Server Component).

### Query cache (existing — not changed by this spec)

TanStack Query already caches:

| Query key prefix | Hook / area |
| ---------------- | ----------- |
| `problem-notes` | `useProblemNotesQuery` |
| `problem-chat` | `useProblemChat`, `useChatSessions` |
| `workspace-code` | `useWorkspaceCodeQuery` |
| `problem-progress` | `useProblemProgressQuery` |

Queries run only when `enabled` (e.g. signed-in user on a problem workspace). An empty devtools panel before visiting a workspace or signing in is expected.

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Dev-only UI | `apps/app/components/devtools/tanstack-devtools.tsx` | Client component; Query plugin registration |
| Root layout | `apps/app/app/layout.tsx` | Unchanged (devtools not mounted here) |
| Query client | `apps/app/components/providers/query-provider.tsx` | Mounts devtools inside `QueryClientProvider` |

## Proposed file structure

```txt
apps/app/components/devtools/
  tanstack-devtools.tsx   # TanStackDevtools + ReactQueryDevtoolsPanel plugin
```

## Out of scope (this pass)

- TanStack Router / Form devtools plugins (not used in this app).
- `@tanstack/devtools-vite` wiring (Next.js dev server does not use Vite for the app bundle).
- Production bundle inclusion (devtools remain dev-only).

## Acceptance criteria

- [x] Spec registered in [00-index.md](./00-index.md).
- [x] `@tanstack/react-query-devtools` added as a dev dependency of `apps/app`.
- [x] Opening devtools in development shows a **TanStack Query** tab with cache entries after loading a signed-in problem workspace.
- [x] Devtools are not included in production builds.
- [x] `pnpm typecheck` passes for `apps/app`.

## Implementation prompt for agents

Implement per this spec: add `components/devtools/tanstack-devtools.tsx`, register `ReactQueryDevtoolsPanel` on `TanStackDevtools`, and mount the devtools inside `QueryProvider` (must be a descendant of `QueryClientProvider`).
