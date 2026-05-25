# Feature update: nav-drawer — list styling & filtered search

## Goal

Improve the left **Problem List** sheet on `/problems/[slug]` so learners can scan the catalog faster: **semibold** row text, **zebra striping**, a **white active row** with dark text (readable against the dark workspace chrome), and a **client-side filtered search** above the list. Behavior stays a flat, id-sorted catalog — no section headers in the drawer.

## Reference

- [06-nav-drawer.md](./06-nav-drawer.md) — shipped sheet shell, data wiring, navigation.
- [04-problems-page-list-ui.md](./04-problems-page-list-ui.md) — row display conventions, zebra tokens, filter/search patterns on `/problems`.
- [01-design-system.md](./01-design-system.md) — feature folder layout, SOLID, semantic tokens.
- [ui-context.md](../ui-context.md) — typography, tokens; workspace nav uses `.problem-by-slug-page` scoped vars.
- [00-index.md](./00-index.md) — parent feature: `nav-drawer`.

## User story

As a learner on a problem page, I want the problem list drawer to look scannable (striped rows, bold titles, obvious current problem) and let me type to narrow the list, so I can jump to the right problem without opening the full `/problems` page.

## Product decisions (locked)

| Topic | Decision |
| ----- | -------- |
| **Active row** | Replace accent highlight with **solid white background** and **dark text** (`bg-white text-neutral-900`). Difficulty label on the active row uses the same difficulty color utilities as today (not forced to neutral). Remove left primary border + `bg-accent/*` active styling. |
| **Active row hover** | Slightly dim white hover on active row only (`hover:bg-white/90`); inactive rows keep existing hover behavior. |
| **Zebra striping** | Alternate row backgrounds by **visible list index** (after sort + filter), same token pairs as `/problems` rows (`problem-list-row.tsx`). Striping **resets** when the filtered set changes (index 0 = even stripe). |
| **Typography** | Problem title (`{id}. {title}`) and difficulty label: **`font-semibold`** (replace `font-medium`). Keep `text-sm` row size. |
| **Search placement** | Fixed toolbar **below** `NavDrawerHeader`, **above** scrollable list. Sticky within sheet content (does not scroll away with rows). |
| **Search behavior** | Client-side only on `problems` already passed into `NavDrawer`. Trim + case-insensitive match on **title** and **numeric id** (e.g. `"217"` or `"contains"`). No API refetch. |
| **Filters (v1)** | **Difficulty** filter only — compact control beside search (toggle group or select: All / Easy / Medium / Hard). AND-combined with search text. |
| **Filter out of scope (v1)** | Status, topic/tag multi-row filter popover (full `/problems` parity). Reuse later if needed. |
| **Empty filter result** | Message in list body: “No problems match” (muted `text-sm`); do not close sheet. |
| **Sort order** | Unchanged: numeric `id` ascending on the filtered subset. |
| **List layout** | Unchanged: flat list, `{id}. {title}` + difficulty on the right; no section headers. |
| **Sheet header** | Unchanged: “Problems” title + description; Home escape hatch per `06-nav-drawer.md`. |

## Requirements

### Visual — rows

- [ ] `NavDrawerProblemRow` accepts `stripeIndex: number` and applies zebra classes aligned with `ProblemListRow` in `features/problems-page/problems-list/components/problem-list-row.tsx`.
- [ ] Active row: `bg-white text-neutral-900`; inactive title text remains `text-foreground/90` → `text-foreground` on hover as today.
- [ ] Title + difficulty: `font-semibold` (title already truncates with `min-w-0`).

### Visual — active state contrast

- [ ] Active styling must read clearly when the sheet opens from the dark workspace header (`.problem-by-slug-page`). White active pill is intentional — do not map active row to `bg-accent` or `bg-primary`.
- [ ] Ensure focus-visible ring still meets a11y on both active and inactive rows.

### Search & filter toolbar

- [ ] New `NavDrawerProblemListToolbar` (or equivalent) in `features/nav-drawer/components/`:
  - Search `Input` with search icon; placeholder e.g. “Search problems…”.
  - Difficulty filter control (All + Easy / Medium / Hard).
  - Compact layout for `sm:max-w-sm` sheet width (`px-4 py-3`, `border-b border-border`, `shrink-0`).
- [ ] Filter state lives in `NavDrawerProblemList` (or `useNavDrawerListQuery` hook) — `useState` for `search` and `difficultyFilter`.
- [ ] Pure helper `matchesNavDrawerListQuery(problem, query)` in `features/nav-drawer/utils/` (can mirror `problemMatchesProblemsListQuery` but scoped to drawer fields; optionally extend search to match slug substring).

### List body

- [ ] `NavDrawerProblemList` filters then sorts (same order as today: id asc).
- [ ] Pass `stripeIndex` from filtered array index into each row.
- [ ] Preserve fetch-error and empty-catalog messages; add filtered-empty message.

### Data & boundaries

- [ ] No route or API changes — still `fetchProblemsList()` on `app/problems/[slug]/page.tsx` → `NavDrawer` props.
- [ ] No changes to `Sheet` primitive or design-system fork.

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `apps/app/features/nav-drawer/` | Toolbar, row styling, filter utils |
| Reuse | `features/problems-page/lib/types` | `Problem` type |
| Reuse | `features/problems-page/problems-list/utils/difficulty-text-class.ts` | Difficulty colors |
| Reuse | `features/problems-page/problems-list/utils/problem-detail-href.ts` | Row links |
| Consumer | `features/problem-workspace/.../problem-slug-nav-header.tsx` | Unchanged props |
| Design system | `@repo/design-system/components/ui/input`, `button` or `select` | No fork under `apps/app` |

## Proposed file structure

```txt
apps/app/features/nav-drawer/
  components/
    nav-drawer.tsx                      # unchanged shell; may pass nothing new
    nav-drawer-header.tsx
    nav-drawer-problem-list-toolbar.tsx # NEW — search + difficulty filter
    nav-drawer-problem-list.tsx         # filter state + stripe indices
    nav-drawer-problem-row.tsx          # semibold, zebra, white active
    nav-drawer-problem-list-trigger.tsx
  utils/
    matches-nav-drawer-list-query.ts    # NEW — pure filter helper
  index.ts
```

## Component responsibilities

### `NavDrawerProblemListToolbar`

- Controlled `search` / `onSearchChange` and `difficultyFilter` / `onDifficultyFilterChange`.
- Optional `filteredCount` for aria-live or subtle count label (nice-to-have, not required for v1).

### `NavDrawerProblemList`

- Owns filter state; composes toolbar + scrollable `<nav>`.
- `useMemo` for filtered + sorted list.

### `NavDrawerProblemRow`

- Renders `SheetClose` + `Link` as today.
- Applies zebra + active + semibold classes.

## Out of scope (this pass)

- Section grouping by `patternSlug`.
- Status / topic / multi-row filter popover (full `/problems` toolbar parity).
- Persisting search or filter in URL or localStorage.
- Highlighting search substring in titles.
- Changes to Problem List trigger button or sheet width.

## Acceptance criteria

- [ ] Opening Problem List on `/problems/[slug]` shows search + difficulty filter above a striped list.
- [ ] Typing in search narrows rows by title or id; difficulty filter AND-combines with search.
- [ ] Current slug row uses **white background** and **dark text**; remains visible when it matches the filter.
- [ ] Non-active rows alternate background colors; indices reset on the filtered list.
- [ ] Row title and difficulty are **semibold**.
- [ ] Row click still closes sheet and navigates to `/problems/[slug]`.
- [ ] Empty filter shows “No problems match”; fetch errors unchanged.
- [ ] `pnpm typecheck` passes for `apps/app`.

## Implementation prompt for agents

Implement per this spec and [06-nav-drawer.md](./06-nav-drawer.md). Reuse zebra token strings from `problem-list-row.tsx` rather than inventing new colors. Active row must use white/dark pairing as locked above. Keep `"use client"` limited to drawer components. Do not add API calls. After shipping, update [progress-tracker.md](../progress-tracker.md) and mark requirements checked here.
