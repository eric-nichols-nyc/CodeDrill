# Problems list: toolbar, filters, sort

The **`/problems`** page uses a compact **toolbar** (search, sort popover, filter popover, count, random) and a **CSS grid list** (no `<table>`) under **`features/problems-page/problems-list/`**.

## Layout

- **Left:** pill search, circular **sort** trigger (field + direction inside a popover), **filter** pill with active count and dot when any row has a value.
- **Right:** filtered **problem count** plus **random** (picks from the current filtered set).

The list is **`ProblemsList`**: a CSS grid (no `<table>`) with **`ProblemsListHeader`** + **`ProblemListRow`** items. Striping uses alternating muted backgrounds; column widths are shared via `lib/layout.ts`.

## Filter model (v1)

- **Filter rows:** each row has `field` (difficulty | status | topic), `operator` (only `is` for now), and `value`.
- **Combination:** all non-empty rows apply with **AND** (every active row must match).
- **Search:** title substring match, combined with the row filters.
- **Topic** values come from unique tags on the loaded problems list (client-side).

Controls: **Add filter**, per-row **remove** (single row resets to one empty row), **Reset** clears to one empty template row.

## Related code

| Path | Role |
|------|------|
| `features/problems-page/problems-list/components/problems-list.tsx` | List container, sort + row map |
| `features/problems-page/problems-list/components/problems-list-header.tsx` | Column headers, sort triggers |
| `features/problems-page/problems-list/components/problem-list-row.tsx` | One row: nav, link, difficulty |
| `features/problems-page/problems-list/lib/layout.ts` | Shared grid column class |
| `features/problems-page/problems-list/utils/sort-problems.ts` | Pure sort by column |
| `features/problems-page/problems-list/components/problems-list-toolbar.tsx` | Toolbar shell |
| `features/problems-page/problems-list/components/problems-list-filter-popover.tsx` | Filter UI |
| `features/problems-page/problems-list/components/problems-list-sort-popover.tsx` | Sort UI |
| `features/problems-page/problems-list/hooks/use-problems-list-filter-rows.ts` | Row state (+ add / remove / update / reset / active count) |
| `features/problems-page/problems-list/utils/matches-problems-list-query.ts` | Pure match: search + filter rows |
| `features/problems-page/problems-list/utils/create-filter-row.ts` | New row factory (stable `id`) |
| `features/problems-page/components/problems-page-view.tsx` | Wiring, pagination, filtered list |

## Next steps (not implemented)

- Persist filters/sort in the URL for shareable lists.
- Move filtering to the API when the dataset outgrows client-side filtering.
- Operators beyond `is`, and OR groups (e.g. match any of a tag set).
