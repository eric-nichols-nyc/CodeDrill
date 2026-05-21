# Feature: nav-drawer

## Goal

On the problem workspace (`/problems/[slug]`), clicking the brand logo should open a **left-side navigation drawer** instead of navigating to the landing page. The drawer shows the **catalog of problems** so users can jump between problems without leaving the workspace. A **link in the drawer header** returns the user to the landing page (`/`).

Today, `AppBrandLink` in `ProblemSlugNavHeader` is a plain `Link` to `/`. This feature replaces that behavior on the problem-detail header only (other headers keep current home navigation unless explicitly extended later).

## Reference

- [01-design-system.md](./01-design-system.md) — feature folder layout, SOLID, semantic tokens.
- [04-problems-page-list-ui.md](./04-problems-page-list-ui.md) — catalog shape, section grouping, row display conventions.
- [00-index.md](./00-index.md) — registry entry for this feature.
- Integration surface: `apps/app/features/problem-detail/components/problem-slug-nav-header.tsx`
- Primitives: `@repo/design-system/components/ui/drawer` (Vaul; supports `direction="left"`).

## User story

As a learner on a problem page, I want to open a problem list from the logo without going home, so I can switch problems quickly and still have an obvious way back to the marketing landing page.

## Product decisions (locked)

| Topic | Decision |
| ----- | -------- |
| **Logo on problem header** | Opens nav drawer; does **not** navigate to `/`. |
| **Drawer direction** | Left (`Drawer` / Vaul `direction="left"`). |
| **Drawer content** | Scrollable list of all catalog problems (same data as `/problems`). |
| **Landing escape hatch** | Text link in **drawer header** → `/` (landing). Not on the logo. |
| **“Problem List” in top bar** | Unchanged for this pass: still links to `/problems` full-page list. |
| **Row navigation** | Each problem links to `/problems/[slug]`; choosing a row closes the drawer. |
| **Current problem** | Visually indicate the active slug in the drawer list. |
| **List layout in drawer** | Compact rows (title + difficulty); **no** section headers in MVP (flat sorted list). Reuse grouping later if needed. |
| **Sort order** | Default: numeric `id` ascending (matches problems-page default). |
| **Auth / fetch** | Same as `/problems`: server fetch via `fetchProblemsList()` on the problem page route, pass parsed list into client drawer. |

## Requirements

### Trigger & header integration

- [ ] In `ProblemSlugNavHeader`, replace `AppBrandLink` (home `Link`) with a control that opens the nav drawer (same logo image and hit target sizing: `h-10 w-10`).
- [ ] Preserve accessible name, e.g. `aria-label="Open problem list"` (not “home”).
- [ ] Drawer is controlled by local state in a small client wrapper (header stays `"use client"`).

### Drawer shell

- [ ] Use design-system `Drawer`, `DrawerContent`, `DrawerHeader`, `DrawerTitle` (optional), `DrawerClose` as needed.
- [ ] Set `direction="left"` on `Drawer` root.
- [ ] Drawer width: use design-system defaults (`sm:max-w-sm` on left drawer); full viewport height, scrollable body.
- [ ] Overlay dismisses drawer; Escape closes drawer.
- [ ] `z-index` must sit above `ProblemSlugNavHeader` (`z-50`) — verify stacking (drawer content typically `z-50`; raise header overlay sibling if overlap issues appear).

### Drawer header

- [ ] Top of drawer: branded row or title (“Problems”) plus a **Next.js `Link` to `/`** labeled e.g. “Home” or “Back to landing” (exact copy flexible; must be clearly landing, not `/problems`).
- [ ] Landing link uses semantic tokens (`text-primary` / `hover:underline` or ghost `Button` variant — match `ui-context.md`).

### Problem list body

- [ ] Render one row per problem from catalog `Problem[]` (see types below).
- [ ] Row shows at minimum: `{id}. {title}` and difficulty (color via existing `difficultyTextClass` or equivalent).
- [ ] Row `href`: `/problems/${slug}` (reuse `problemDetailHref` from `features/problems-page/problems-list/utils/problem-detail-href.ts`).
- [ ] Active row: distinct background or left border using `--nav-*` or `accent` tokens consistent with problem header theme.
- [ ] Empty catalog: short message in drawer body (“No problems loaded”).
- [ ] Fetch failure: short error message; drawer still opens (logo remains usable).

### Data loading

- [ ] `apps/app/app/problems/[slug]/page.tsx` (server): call `fetchProblemsList()`, parse with existing `parseProblemsListBody` + `mapRowsToProblems` from `features/problems-page/lib/`.
- [ ] Pass `initialProblems: Problem[]` and `currentSlug: string` into `ProblemSlugNavHeader` (or into `NavDrawer` child).
- [ ] No new API endpoints for MVP.

### Feature folder

- [ ] New feature colocated at `apps/app/features/nav-drawer/` per design-system conventions.

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `apps/app/features/nav-drawer/` | Drawer, list, trigger wiring |
| Consumer | `apps/app/features/problem-detail/components/problem-slug-nav-header.tsx` | Hosts trigger + composes drawer |
| Route (thin) | `apps/app/app/problems/[slug]/page.tsx` | Fetches catalog once per page load |
| List parsing (reuse) | `apps/app/features/problems-page/lib/` | `parseProblemsListBody`, `mapRowsToProblems`, `Problem` type |
| API | `GET /problems` via `apps/app/lib/problems/fetch-problems-list.ts` | Existing catalog |
| Design system | `packages/design-system/components/ui/drawer.tsx` | Do not fork under `apps/app` |

## API

No new endpoints. Reuse list response documented in [04-problems-page-list-ui.md](./04-problems-page-list-ui.md).

```ts
// apps/app/features/problems-page/lib/types.ts (reuse)
type Problem = {
  id: number;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  // …other fields optional in drawer rows
};
```

## Proposed file structure

```txt
apps/app/features/nav-drawer/
  components/
    nav-drawer.tsx              # Drawer root + open state API
    nav-drawer-trigger.tsx      # Logo button wrapping AppBrandLink visuals
    nav-drawer-header.tsx       # Title + landing Link
    nav-drawer-problem-list.tsx # Scrollable list
    nav-drawer-problem-row.tsx  # Single link row
  index.ts                      # optional barrel exports

apps/app/features/problem-detail/components/
  problem-slug-nav-header.tsx   # compose NavDrawer + pass currentSlug, problems

apps/app/app/problems/[slug]/page.tsx
  # fetchProblemsList + pass props
```

## Component responsibilities

### `NavDrawer`

- Owns `open` / `onOpenChange` state (or accepts controlled props from header).
- Renders `Drawer` with `direction="left"`.
- Slots: `trigger`, `problems`, `currentSlug`, optional `fetchOk` / `fetchStatus` for error UI.

### `NavDrawerTrigger`

- Renders logo (`Image` from `/logo.png` or thin wrapper around shared brand styles).
- `type="button"`; does not use `AppBrandLink` as a `Link` (may reuse image markup only).

### `NavDrawerHeader`

- Drawer title area.
- **Landing link** → `href="/"`.

### `NavDrawerProblemList` / `NavDrawerProblemRow`

- Presentational; sorted flat list.
- Row navigates and closes drawer on click (via `DrawerClose` asChild on `Link`, or `onOpenChange(false)` on navigate).

### `ProblemSlugNavHeader` (changes)

- Accept `problems: Problem[]`, `currentSlug: string`, and optional fetch metadata.
- Render `NavDrawer` with trigger in place of `AppBrandLink`.

## Routes (thin)

`apps/app/app/problems/[slug]/page.tsx`:

1. Existing `fetchProblemBySlug(slug)` unchanged.
2. Add `fetchProblemsList()` in parallel (or sequential — prefer `Promise.all` if both needed).
3. Map list body → `Problem[]`.
4. Pass `problems`, `currentSlug={slug}`, and fetch flags into `ProblemSlugNavHeader`.

## UX notes

- **Motion**: Rely on Vaul / design-system drawer animations; no custom animation required in MVP.
- **Focus**: Ensure focus trap and return focus to logo trigger on close (Vaul default).
- **Mobile**: Left drawer at `w-3/4` default is acceptable; list must scroll inside drawer body.

## Out of scope (this pass)

- Changing `AppBrandLink` globally (landing header, problems page header still link home).
- Section headers / `patternSlug` grouping inside the drawer (flat list only).
- Search, filters, or pagination inside the drawer.
- Previous / next / random nav buttons in `ProblemSlugNavHeader` (remain placeholders).
- Client-side refetch or SWR for catalog; server pass-through only.
- Persisting drawer open state across navigations.
- Replacing the top-bar “Problem List” link with the drawer.

## Acceptance criteria

- [ ] Clicking the logo on `/problems/[slug]` opens a left drawer; URL does not change until a problem row is chosen.
- [ ] Drawer lists catalog problems with title and difficulty; active slug is highlighted.
- [ ] Drawer header contains a working link to `/` (landing).
- [ ] Selecting a problem navigates to that slug and closes the drawer.
- [ ] Feature files live under `apps/app/features/nav-drawer/`.
- [ ] Spec registered in [00-index.md](./00-index.md).
- [ ] `pnpm typecheck` passes for `apps/app`.

## Implementation prompt for agents

Implement feature `nav-drawer` per this spec and [01-design-system.md](./01-design-system.md). Start by adding `features/nav-drawer/` components, then wire `ProblemSlugNavHeader` and `app/problems/[slug]/page.tsx` data fetch. Reuse `features/problems-page/lib` parsers and `problemDetailHref`. Do not add Drawer source under `apps/app`; import from `@repo/design-system/components/ui/drawer`. Update `progress-tracker.md` when the slice ships.
