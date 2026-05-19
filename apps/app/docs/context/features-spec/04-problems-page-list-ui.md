# Feature update: problems-page — list tags & study-plan sections

## Goal

On `/problems`, render a LeetCode 75–style catalog: problems grouped under fixed study-plan **section headers**, each row showing `{id}. {title}`, **tags under the title**, and difficulty on the right. Sections come from each problem’s **`patternSlug`** on the API (not from tags).

## Reference

- [01-design-system.md](./01-design-system.md) — feature folder layout, SOLID, semantic tokens.
- [00-index.md](./00-index.md) — parent feature: `problems-page`.
- Visual reference: grouped headers (Array / String, Two Pointers, …) + rows with tags under title.

## Product decisions (locked)

| Topic | Decision |
| ----- | -------- |
| **Section (group header)** | `problems.pattern_slug` / API `patternSlug`. **Not** inferred from tags. |
| **Section catalog** | Fixed ordered list in `problem-list-sections.ts` (see below). |
| **Unknown / missing slug** | Section **Uncategorized** (always last). |
| **Title** | `{id}. {title}` in one cell; no separate `#` column. |
| **Tags under title** | Up to 2 pills + `+N`; display-only; Title Case from slug/name. |
| **Sort** | Column sort applies **within each section** only. |
| **Empty sections** | Hidden (no header if no problems in that section). |

### Section catalog (order)

| Order | Header label | `patternSlug` values |
| ----- | ------------ | -------------------- |
| 1 | Array / String | `array-string`, `array`, `string` |
| 2 | Two Pointers | `two-pointers` |
| 3 | Sliding Window | `sliding-window` |
| 4 | Hash Map / Set | `hash-map`, `hash-set`, `hash-table` |
| last | Uncategorized | missing or unrecognized slug |

## User story

As a learner, I want problems grouped by study-plan section with tags under each title, so I can progress through topics the way LeetCode 75 is organized.

## Requirements

### Data

- [x] `GET /problems` returns `tags[]` per problem (`problem_tags` join).
- [x] List items include `patternSlug` from the `problems` row (already on entity; parsed in app).
- [x] `Problem.patternSlug` on the client; `parseProblemsListBody` accepts `patternSlug` or `pattern_slug`.

### UI

- [x] `groupProblemsBySection` buckets by resolved section id.
- [x] `ProblemListSection` renders header + rows.
- [x] `ProblemsList` renders sections (not a flat list).
- [x] Section header: full width, `bg-muted/30`, `border-b border-border`.
- [x] Zebra striping resets per section.
- [x] `ProblemListRow`: `{id}. {title}` + `ProblemListTagPills` under title.

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `apps/app/features/problems-page/` | List, sections, rows |
| API | `apps/api/src/problems/` | `findAll` returns problem row + tags |
| Database | `problems.pattern_slug`, `problem_tags` | |

## API list item shape

```ts
{
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  patternSlug: string | null;
  tags: { id: string; name: string; slug: string }[];
}
```

## File structure

```txt
features/problems-page/problems-list/
  lib/problem-list-sections.ts
  utils/group-problems-by-section.ts
  components/
    problem-list-section.tsx
    problem-list-tag-pills.tsx
    problem-list-row.tsx
    problems-list.tsx
```

## Out of scope

- Click tag → apply toolbar filter.
- Flat / ungrouped toggle.
- Pagination per section.
- New DB column (use existing `pattern_slug`).

## Acceptance criteria

- [x] Section headers appear in catalog order when problems exist in each section.
- [x] Each problem appears in exactly one section (from `patternSlug`).
- [x] Tags render under title; difficulty unchanged.
- [x] Topic filter still matches `problem.tags`.
- [ ] Admin: set `patternSlug` on problems meant for Array / String (`array-string` etc.).

## Implementation prompt for agents

Implement per this spec. Grouping uses `patternSlug` and `problem-list-sections.ts`. Do not group by first tag. Sort within sections only. Use semantic design-system tokens.
