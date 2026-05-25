# Feature update: nav-drawer — list styling & `/problems` toolbar parity

## Goal

Improve the left **Problem List** sheet on `/problems/[slug]` so it behaves like the **`/problems` catalog toolbar**: same search, multi-row filters, sort, filtered count, and random pick — all client-side on the loaded catalog. Row styling adds **semibold** text, **zebra striping**, and a **white active row** with dark text for the current slug. The drawer list stays **flat** (no study-plan section headers) to fit the narrow sheet.

## Reference

- [06-nav-drawer.md](./06-nav-drawer.md) — shipped sheet shell, data wiring, navigation.
- [04-problems-page-list-ui.md](./04-problems-page-list-ui.md) — catalog toolbar, filter rows, sort, zebra rows.
- [01-design-system.md](./01-design-system.md) — feature folder layout, SOLID, semantic tokens.
- [ui-context.md](../ui-context.md) — typography, tokens; workspace nav uses `.problem-by-slug-page` scoped vars.
- [00-index.md](./00-index.md) — parent feature: `nav-drawer`.

**Reuse (do not duplicate):**

| Module | Path |
| ------ | ---- |
| Toolbar | `features/problems-page/problems-list/components/problems-list-toolbar.tsx` |
| Filter popover | `features/problems-page/problems-list/components/problems-list-filter-popover.tsx` |
| Sort popover | `features/problems-page/problems-list/components/problems-list-sort-popover.tsx` |
| Filter hook | `features/problems-page/problems-list/hooks/use-problems-list-filter-rows.ts` |
| Match helper | `features/problems-page/problems-list/utils/matches-problems-list-query.ts` |
| Sort helper | `features/problems-page/problems-list/utils/sort-problems.ts` |
| Zebra tokens | `features/problems-page/problems-list/components/problem-list-row.tsx` |

## User story

As a learner on a problem page, I want the drawer problem list to filter and sort the same way as `/problems`, with scannable striped rows and an obvious current problem, so I can jump to another problem without relearning different controls.

## Product decisions (locked)

| Topic | Decision |
| ----- | -------- |
| **Toolbar parity** | **Reuse `ProblemsListToolbar` unchanged** — search input, sort popover, filter popover (difficulty / status / topic rows with AND logic), filtered count label, random shuffle button. Same placeholder (“Search problems…”), same filter popover copy, same default sort (`id` asc). |
| **Search behavior** | **Identical to `/problems`:** trim + case-insensitive substring match on **`title` only** via `problemMatchesProblemsListQuery`. No drawer-specific search rules. |
| **Filters** | **Identical to `/problems`:** `useProblemsListFilterRows` + multi-row popover; fields `difficulty`, `status`, `topic`; rows combine with AND; `availableTopics` derived from loaded `problems` tags (same as `ProblemsPageView`). |
| **Sort** | **Same fields and directions** as `/problems` (`SortField`, `SortDirection`). Apply `sortProblems(filtered, sortField, sortDirection)` on the **flat** filtered list (global sort — no section grouping in the drawer). |
| **Random problem** | Pick uniformly from **filtered** list (same as `/problems`). Navigate to `/problems/[slug]` and **close the sheet** (`setOpen(false)` or equivalent). No-op when filtered list is empty. |
| **Toolbar placement** | Sticky block below `NavDrawerHeader`, above scrollable list (`shrink-0 border-b border-border px-4 py-3`). Pass `className` only for drawer width stacking if needed — do not fork toolbar markup. |
| **Active row** | Replace accent highlight with **solid white background** and **dark text** (`bg-white text-neutral-900`). Difficulty label keeps `difficultyTextClass` colors. Remove left primary border + `bg-accent/*` active styling. |
| **Active row hover** | `hover:bg-white/90` on active row; inactive rows keep zebra + hover from `/problems` tokens. |
| **Zebra striping** | Same token pairs as `ProblemListRow`; index from **filtered + sorted** flat list (index 0 = even stripe). |
| **Typography** | `{id}. {title}` and difficulty: **`font-semibold`**. Row size stays compact (`text-sm`) for the narrow sheet. |
| **List layout** | **Flat** list only — no `groupProblemsBySection`, no section headers, no tag pills in drawer rows (unchanged compact `{id}. {title}` + difficulty). |
| **Empty filter result** | Same copy as `/problems`: “No problems match your filters.” |
| **Sheet header** | Unchanged per `06-nav-drawer.md`. |
| **Data** | No API or route changes — same `fetchProblemsList()` → `NavDrawer` props. |

## Requirements

### Toolbar — reuse `/problems`

- [x] `NavDrawerProblemList` composes **`ProblemsListToolbar`** with the same props wired as `ProblemsPageView` (search, filter rows, sort, count, random).
- [x] Use **`useProblemsListFilterRows`** for filter state.
- [x] Use **`problemMatchesProblemsListQuery`** for filtering — no `matches-nav-drawer-list-query.ts`.
- [x] Compute `availableTopics` from `problems` tags the same way as `ProblemsPageView`.
- [x] Default sort: `sortField = "id"`, `sortDirection = "asc"`.

### List body

- [x] Filter with `problemMatchesProblemsListQuery`, then sort with `sortProblems`.
- [x] Pass `stripeIndex` from sorted index into `NavDrawerProblemRow`.
- [x] Preserve fetch-error and empty-catalog messages; use `/problems` empty-filter copy.
- [x] Random handler: `router.push` + close sheet.

### Visual — rows (drawer-specific)

- [x] `NavDrawerProblemRow`: zebra classes from `problem-list-row.tsx`, white/dark active state, `font-semibold`.
- [x] Focus-visible ring on active and inactive rows.

### Data & boundaries

- [x] No new filter/sort/toolbar files under `nav-drawer/` unless a thin wrapper is required for random + sheet close only.
- [x] No design-system fork.

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `apps/app/features/nav-drawer/` | List orchestration, row styling, sheet close on navigate |
| Reuse | `features/problems-page/problems-list/**` | Toolbar, hooks, match + sort utils |
| Reuse | `features/problems-page/lib/types` | `Problem`, `SortField`, `SortDirection` |
| Consumer | `features/problem-workspace/.../problem-slug-nav-header.tsx` | Unchanged props |
| Route | `app/problems/[slug]/page.tsx` | Unchanged catalog fetch |

## Proposed file structure

```txt
apps/app/features/nav-drawer/
  components/
    nav-drawer.tsx
    nav-drawer-header.tsx
    nav-drawer-problem-list.tsx         # toolbar + filter/sort state + list
    nav-drawer-problem-row.tsx          # zebra, white active, semibold, SheetClose
    nav-drawer-problem-list-trigger.tsx
  index.ts
```

No new `utils/` or toolbar component in `nav-drawer/` — import from `features/problems-page/problems-list/`.

## Component responsibilities

### `NavDrawerProblemList`

- Owns `search`, sort state, `useProblemsListFilterRows`, `useRouter`.
- Accepts optional `onNavigate?: () => void` from parent `NavDrawer` to close sheet on row click / random (or receives `setOpen` via prop).
- Composes `ProblemsListToolbar` + scrollable `<nav>` of `NavDrawerProblemRow`.

### `NavDrawerProblemRow`

- Unchanged navigation: `SheetClose` + `Link` → `/problems/[slug]`.
- Drawer-only visuals: zebra, white active, semibold.

## Out of scope (this pass)

- Section grouping, tag pills, status icons, favorites (full `ProblemListRow` in drawer).
- Pagination (drawer shows full filtered set).
- Column header sort UI (`ProblemsListHeader` click-to-sort).
- Persisting search/filter/sort in URL or localStorage.
- Shared filter state between `/problems` and the drawer.
- Widening the sheet to fit desktop toolbar on one row (stacking via existing toolbar responsive classes is OK).

## Acceptance criteria

- [x] Drawer toolbar is **`ProblemsListToolbar`** — search, sort popover, filter popover, count, random — behaving like `/problems`.
- [x] Filter rows (difficulty / status / topic) AND-combine with search; empty filter shows “No problems match your filters.”
- [x] Sort popover fields match `/problems`; sorted order applies to flat filtered list.
- [x] Random picks from filtered set, navigates, and closes sheet.
- [x] Current slug: **white bg**, **dark text**, **semibold**; other rows zebra-striped.
- [x] Row click closes sheet and navigates.
- [ ] `pnpm typecheck` passes for `apps/app`.

## Implementation prompt for agents

Implement per this spec and [06-nav-drawer.md](./06-nav-drawer.md). **Import** toolbar, hook, and utils from `features/problems-page/problems-list/` — do not copy or reimplement filter/search logic. Reuse zebra class strings from `problem-list-row.tsx`. Wire sheet close on random + row navigation through `NavDrawer`. After shipping, update [progress-tracker.md](../progress-tracker.md) and check requirements here.
