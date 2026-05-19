# Feature update: problems-page — list tags & topic grouping

## Goal

Improve the problems list to match a study-plan style layout: problems grouped under topic section headers (e.g. **Array / String**), topic tags visible on each row, and titles shown as `{id}. {title}`. Wire `Problem.tags` from the catalog API instead of empty placeholders in `mapRowsToProblems`.

## Reference

- [01-design-system.md](./01-design-system.md) — feature folder layout, SOLID, semantic tokens.
- [00-index.md](./00-index.md) — parent feature: `problems-page`.
- Visual reference: LeetCode-style grouped list (category header row + problem rows with status, combined id/title, difficulty on the right).

Existing code to extend (do not duplicate):

- `features/problems-page/problems-list/components/problem-list-row.tsx`
- `features/problems-page/problems-list/components/problems-list.tsx`
- `features/problems-page/problems-list/components/problems-list-header.tsx`
- `features/problems-page/problems-list/lib/layout.ts`
- `features/problems-page/lib/map-rows-to-problems.ts`
- `features/problems-page/lib/parse-problems-list-body.ts`
- `features/problems-page/problems-list/utils/matches-problems-list-query.ts` (topic filter uses `problem.tags`)

## Product decisions (locked)

| Topic | Decision |
| ----- | -------- |
| Primary topic for grouping | First tag in `problem.tags` sorted alphabetically on the problem; if none, section **`Uncategorized`**. |
| Title column | Single cell: **`{id}. {title}`**; remove separate `#` column from grid in grouped list. |
| Grouping vs sort | **Always group by primary topic.** Column sort applies **within each section** only (not a global flat reorder). |
| Tags on row | Up to **2** tag pills + **`+N`** if more; **display-only** in v1 (no click-to-filter). |
| API tag shape | List returns `tags: { name: string; slug: string }[]`; app maps to `Problem.tags` as **display names** (`name`). |

## User story

As a learner browsing problems, I want the list grouped by topic with tags on each row, so I can scan a study plan by category and see what each problem covers at a glance.

## Requirements

### Pass A — data (catalog tags)

- [x] Extend catalog list response (API and BFF if applicable) to include tags per problem via `problem_tags` / `tags` join.
- [x] Update `ApiProblemRow` in `map-rows-to-problems.ts` with optional `tags?: { name: string; slug: string }[]`.
- [x] Update `parseProblemsListBody` to parse tag arrays from list JSON.
- [x] Update `mapRowsToProblems` to set `tags: (row.tags ?? []).map((t) => t.name)` (non-empty when API provides tags).
- [x] Topic filter in toolbar (`field: "topic"`) continues to match against populated `problem.tags`.

### Pass B — UI (grouping & row layout)

- [ ] Add pure util `groupProblemsByTopic` in `problems-list/utils/`.
- [ ] Add `ProblemListSection` component: section header + child rows.
- [ ] Update `ProblemsList` to render sections instead of a flat list.
- [ ] Section header: topic label only, full width, `bg-muted/30`, `border-b border-border`, not interactive.
- [ ] Section order: alphabetical by topic label (`Uncategorized` last or first — use **last**).
- [ ] Zebra striping resets per section (`stripeIndex` starts at 0 in each group).
- [ ] Update `problemsListGridClassName` and `ProblemsListHeader` for new columns (tags column; drop `#` column).
- [ ] `ProblemListRow`: show `{id}. {title}`; add tag pills cell; keep difficulty, status, favorite, solution icon as today.
- [ ] Sort within section: apply existing `sortProblems` to each group's `problems` array before render.

### Styling

- [ ] Semantic tokens only (`bg-muted`, `text-primary`, `difficultyTextClass`, `border-border`).
- [ ] Tag pills: `text-xs`, `rounded-md`, `bg-muted`, `text-muted-foreground`, truncate long names.
- [ ] No new primitives under `apps/app/components/ui/`.

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `apps/app/features/problems-page/` | List, row, utils, hooks |
| BFF | `apps/app/app/api/...` (catalog route) | Pass through tags from API |
| API | `apps/api/src/problems/` | `findAll` or list handler with tags join |
| Database | `problem_tags`, `tags` | Already exist in schema |

## API (catalog list)

### Current gap

`ProblemsService.findAll` returns problem rows only. Tags load in `findBySlugWithDetails` via `problem_tags` join. The list endpoint must include tags (batch join or subquery) for all returned problems.

### Target list item shape

```ts
export type ApiProblemRow = {
  id?: string;
  slug: string;
  title: string;
  difficulty?: string;
  tags?: { name: string; slug: string }[];
};
```

### App mapping

```ts
tags: (row.tags ?? []).map((t) => t.name),
```

## Proposed file structure (additions)

```txt
features/problems-page/problems-list/
  components/
    problem-list-section.tsx
    problem-list-tag-pills.tsx    # optional extract from row
  utils/
    group-problems-by-topic.ts
```

## Component responsibilities

### `groupProblemsByTopic` (util)

- **Input:** `Problem[]`, `sortField`, `sortDirection`.
- **Output:** `{ topic: string; problems: Problem[] }[]`.
- **Logic:** For each problem, `primaryTopic = sorted(problem.tags)[0] ?? "Uncategorized"`. Group by `primaryTopic`. Sort sections alphabetically; put `Uncategorized` last. Sort each group's problems with `sortProblems`.

### `ProblemListSection`

```ts
type ProblemListSectionProps = {
  topic: string;
  problems: Problem[];
};
```

- Renders section header + `ProblemListRow` for each problem.
- Passes `stripeIndex` 0..n-1 within the section.

### `ProblemListRow` (update)

- Title cell: `{problem.id}. {problem.title}`.
- New tags cell via `ProblemListTagPills` or inline (max 2 pills + `+N`).
- Grid aligned with `ProblemsListHeader` via shared `problemsListGridClassName`.

### `ProblemsList` (update)

- After global `sortProblems` is removed from flat list, delegate per-section sort inside `groupProblemsByTopic`.
- Map sections to `ProblemListSection`.

### `ProblemsListHeader` (update)

- Remove `#` column header and sort button.
- Add **Tags** column label (non-sortable in v1).

## Out of scope (this pass)

- Clicking a tag to apply toolbar filter.
- Flat / ungrouped list toggle.
- Selected-row `text-primary` highlight (unless `selectedSlug` is already passed from parent).
- Real external problem numbers (list still uses display `id` from catalog order).
- Pagination changes per section.
- Drag-and-drop section reorder.

## Acceptance criteria

- [x] Catalog fetch returns tags; list shows non-empty tags for problems that have `problem_tags` in DB.
- [ ] List renders topic section headers matching study-plan layout.
- [ ] Each row shows tag pills and `{id}. {title}` in one title cell.
- [ ] Difficulty colors unchanged (`difficultyTextClass`).
- [ ] Topic filter in toolbar works with real tag data.
- [ ] `pnpm typecheck` passes for `apps/app` and `apps/api` if API touched.

## Implementation prompt for agents

Implement the problems-page list update per this spec and `01-design-system.md`.

**Pass A:** Extend API list (and BFF if needed) to return `tags` per problem. Update `parseProblemsListBody` and `mapRowsToProblems` so `Problem.tags` is populated.

**Pass B:** Add `groupProblemsByTopic` and `ProblemListSection`. Update `ProblemsList`, `problem-list-row.tsx`, `problems-list-header.tsx`, and `layout.ts` for grouped sections, a tags column, and `{id}. {title}` format. Sort within sections only. Keep routes thin. Use `@repo/design-system` tokens only; no new app-level UI primitives.

Do not implement out-of-scope items in this pass.
