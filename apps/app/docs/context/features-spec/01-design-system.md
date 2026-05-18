# Feature UI — design system & component structure

Read **[AGENTS.md](../../AGENTS.md)** and **[ui-context.md](../ui-context.md)** before starting.

## Where code lives

All feature UI belongs under **`apps/app/features/<feature-name>/`**, not in `apps/app/components/` unless it is truly shared across multiple features (e.g. `split-layout`).

Each feature uses dedicated subfolders:

```
features/<feature-name>/
  components/     # Presentational & composed UI (.tsx)
  hooks/          # State, effects, data orchestration (use-*)
  utils/          # Pure functions — no React, no hooks
  lib/            # Optional: schemas, types, API helpers for this feature
```

Nested UI can mirror the same shape (see `problem-detail/components/problem-workspace/`):

```
components/<area>/
  components/
  hooks/
  utils/
  queries/        # Optional: TanStack Query keys, fetchers, mutations
```

**Routes** in `apps/app/app/` stay thin: fetch data, compose feature components, no business logic.

## SOLID — how we build components

Apply these when creating or refactoring feature UI:

| Principle | In practice |
| --------- | ----------- |
| **S** — Single responsibility | One component = one UI concern (layout, list row, form field). One hook = one behavior slice (filter state, workspace run/submit). |
| **O** — Open/closed | Extend via props, composition, or variants — not by editing shared primitives. Add shadcn components to `@repo/design-system`, not forks in features. |
| **L** — Liskov substitution | Child components honor parent contracts (required props, stable callbacks). Don’t change meaning of shared prop names across siblings. |
| **I** — Interface segregation | Keep props small and focused. Split “god components” into container + presentational pieces with narrow prop types. |
| **D** — Dependency inversion | Components depend on hooks/abstractions, not raw fetch details. Pass data and handlers in; keep API/query logic in `hooks/` or `queries/`. |

## Split: components vs hooks vs utils

| Layer | Put here | Examples |
| ----- | -------- | -------- |
| **`components/`** | JSX, layout, wiring props to design-system primitives | `ProblemOutputPanel`, `ProblemsListToolbar` |
| **`hooks/`** | `useState`, `useEffect`, `useMemo`, TanStack Query usage, event handlers that coordinate state | `useProblemWorkspace`, `useProblemsListFilterRows` |
| **`utils/`** | Pure transforms, formatters, sort/filter helpers, parsers | `formatTestcaseInputFields`, `sortProblems`, `matchesProblemsListQuery` |

**Rules**

- If a component file exceeds ~150 lines or mixes fetching + heavy transforms + markup, extract a hook and/or utils.
- Hooks may call utils; utils must not import hooks or components.
- Prefer **named exports** for components and hooks.
- Add `"use client"` only on files that need browser APIs or hooks — keep leaf presentational components as Server Components when possible.

**Anti-patterns**

- Large `useEffect` blocks and business rules inline in JSX
- Duplicating the same pure function across two components (move to `utils/`)
- New UI primitives under `apps/app/components/ui/` (use `@repo/design-system`)

## Design system usage

- Import primitives from `@repo/design-system/components/ui/*`
- Use `cn()` from `@repo/design-system/lib/utils` for conditional classes
- Use semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`) — see **ui-context.md**
- Icons: `lucide-react` only

```ts
import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
```

## Example: adding a new feature area

```
features/my-feature/
  components/
    my-feature-view.tsx      # composes children, minimal logic
    my-feature-row.tsx       # presentational
  hooks/
    use-my-feature.ts        # state + handlers
  utils/
    format-my-feature.ts     # pure helpers
```

`app/my-route/page.tsx` imports from `@/features/my-feature/components/...` and passes server-fetched props down.

### Check when done

- [ ] UI lives under `features/<name>/` with `components/`, `hooks/`, and `utils/` as needed
- [ ] Complex logic is in hooks/utils, not bloated component files
- [ ] All components import without errors
- [ ] Uses `@repo/design-system` tokens — no stray default light styling or hardcoded hex (except documented scoped overrides)
- [ ] `pnpm typecheck` passes for `apps/app`
