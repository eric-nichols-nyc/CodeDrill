# Feature: problem-slug-nav

## Goal

Rotate through the problem catalog from `/problems/[slug]` using the prev/next/random controls in the slug nav header, using the same default catalog order as the problems list (`id` ascending).

## Reference

- [01-design-system.md](./01-design-system.md)
- [04-problems-page-list-ui.md](./04-problems-page-list-ui.md) — catalog parse/sort helpers

## Requirements

### Navigation

- [x] Prev/next wrap around the ordered slug list.
- [x] Random picks a different slug when possible.
- [x] Controls disabled when the catalog has 0–1 problems.
- [x] Server page loads catalog slugs alongside the current problem bundle.

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `apps/app/features/problem-slug-nav/` | hook + utils + connected header |
| Route | `apps/app/app/problems/[slug]/page.tsx` | passes `catalogSlugs`, `currentSlug` |
| Catalog API | existing `GET /problems` via `fetchProblemsList` | no new BFF |

## File structure

```
features/problem-slug-nav/
  components/problem-slug-nav-header-connected.tsx
  hooks/use-problem-slug-navigation.ts
  utils/build-catalog-slugs.ts
  utils/get-adjacent-slug.ts
```

## Acceptance criteria

- [x] Chevron left/right on slug page navigates to adjacent problem in catalog order.
- [x] Shuffle navigates to a random other problem when catalog size > 1.
- [x] `pnpm typecheck` passes in `apps/app`.
