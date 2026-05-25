# Feature: nav-drawer

> **Naming:** Feature folder is `nav-drawer` (product name). **UI primitive is shadcn `Sheet`** (`side="left"`), not Vaul `Drawer`. Use `@repo/design-system/components/ui/sheet`.

## Goal

On the problem workspace (`/problems/[slug]`), clicking **Problem List** in the header opens a **left-side sheet** with the full problem catalog so users can jump between problems without leaving the workspace. A **Home** link in the sheet header returns to the landing page (`/`). The **logo** stays a normal link to `/`.

## Reference

- [01-design-system.md](./01-design-system.md) — feature folder layout, SOLID, semantic tokens.
- [04-problems-page-list-ui.md](./04-problems-page-list-ui.md) — catalog shape, row display conventions.
- [00-index.md](./00-index.md) — registry entry for this feature.
- Integration: `apps/app/features/problem-workspace/components/problem-slug-nav-header.tsx`
- Primitive: `@repo/design-system/components/ui/sheet` (`Sheet`, `SheetContent`, `SheetTrigger`, `SheetClose`, `side="left"`).

## User story

As a learner on a problem page, I want to open a problem list from the header without going to the full `/problems` page, so I can switch problems quickly and still have an obvious way back to the marketing landing page.

## Product decisions (locked — shipped)

| Topic | Decision |
| ----- | -------- |
| **Trigger** | **Problem List** button in `ProblemSlugNavHeader` (`NavDrawerProblemListTrigger`). |
| **Logo** | `AppBrandLink` → `/` (home). Does **not** open the sheet. |
| **Panel primitive** | Left **Sheet** (`side="left"`), not Vaul Drawer. |
| **Panel content** | Scrollable flat list of all catalog problems (same data as `/problems`). |
| **Landing escape hatch** | **Home** link in sheet header → `/`. |
| **Row navigation** | Each problem links to `/problems/[slug]`; row wrapped in `SheetClose`. |
| **Current problem** | Active slug highlighted (left border + accent background). |
| **List layout** | Compact rows (`{id}. {title}` + difficulty); no section headers in MVP. |
| **Sort order** | Numeric `id` ascending. |
| **Auth / fetch** | Server `fetchProblemsList()` on problem page; pass `Problem[]` into client sheet. |

## Requirements (shipped)

### Trigger & header

- [x] **Problem List** opens the sheet via `SheetTrigger asChild` on `NavDrawerProblemListTrigger` (`forwardRef` required).
- [x] Logo uses `AppBrandLink` → `/`.
- [x] Open state: `useState` in `NavDrawer`.

### Sheet shell

- [x] `Sheet` + `SheetContent side="left"`; `z-[100]` on content.
- [x] Overlay / Escape / built-in close dismiss the sheet.

### Sheet header

- [x] Title “Problems” + **Home** → `/`.

### Problem list body

- [x] Flat sorted list; `problemDetailHref`; `difficultyTextClass`; active row styling.
- [x] Empty / fetch-error messages in body.

### Data loading

- [x] `app/problems/[slug]/page.tsx`: `Promise.all` for slug + list; `parseProblemsListBody` + `mapRowsToProblems`.
- [x] Props: `problems`, `currentSlug`, `fetchOk`, `fetchStatus` → `ProblemSlugNavHeader` → `NavDrawer`.

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `apps/app/features/nav-drawer/` | Sheet shell, list, Problem List trigger |
| Consumer | `features/problem-workspace/.../problem-slug-nav-header.tsx` | Logo + `NavDrawer` |
| Route | `app/problems/[slug]/page.tsx` | Parallel catalog fetch |
| List parsing | `features/problems-page/lib/` | Reuse parsers + `Problem` type |
| API | `GET /problems` via `lib/problems/fetch-problems-list.ts` | Existing |
| Design system | `packages/design-system/components/ui/sheet.tsx` | Do not fork under `apps/app` |

## File structure (as built)

```txt
apps/app/features/nav-drawer/
  components/
    nav-drawer.tsx                      # Sheet root + open state
    nav-drawer-problem-list-trigger.tsx # Problem List button (trigger)
    nav-drawer-header.tsx               # SheetHeader + Home link
    nav-drawer-problem-list.tsx
    nav-drawer-problem-row.tsx          # SheetClose + Link per row
  index.ts
```

## Out of scope

- Vaul `Drawer` for this feature (use Sheet for left panels).
- Section grouping inside the sheet (flat list only in MVP).
- Client-side catalog refetch.
- Logo as sheet trigger.

**Follow-up (not in MVP):** list styling + filtered search — [12-nav-drawer-list-ui.md](./12-nav-drawer-list-ui.md).

## Acceptance criteria

- [x] **Problem List** on `/problems/[slug]` opens left sheet; URL unchanged until a row is chosen.
- [x] Sheet lists catalog with active slug highlighted.
- [x] Sheet header **Home** → `/`.
- [x] Row navigation closes sheet and loads new slug.
- [x] `pnpm typecheck` passes for `apps/app`.

## Implementation note for agents

Import **Sheet** from `@repo/design-system/components/ui/sheet`. Do not use `drawer.tsx` (Vaul) for left-side catalog navigation. Trigger must `forwardRef` when using `SheetTrigger asChild`.
