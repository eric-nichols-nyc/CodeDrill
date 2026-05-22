# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Admin catalog shipped (v1); optional catalog_key API next

## Current Goal

- None — pick next admin slice or wire admin chat to API

## Completed

- `nav-drawer` — Problem List on workspace header opens left Sheet with catalog; sheet header Home → `/`; logo stays home link; `/problems/[slug]` parallel `fetchProblemsList`
- `problem-slug-nav` — prev/next/random on workspace header rotate through catalog (`id` asc, wrap-around); `ProblemSlugNavHeaderConnected` + `useProblemSlugNavigation`
- `admin-chat-layout` feature: global header with Ask AI toggle, right slide-out panel, static message list/input, hooks for panel and chat state
- Admin route wraps `AdminPageShell` in `AdminChatLayout`
- Feature spec `05-admin-problem-filter.md` (catalog registry, added status, filters)
- Admin catalog tab on `/admin`: template registry, added/not-added badges, search + difficulty + status filters, `/admin/add?catalogKey=` prefill with stable slug

## In Progress

- None.

## Next Up

- Optional `problems.catalog_key` column for stable template ↔ DB matching (v1.1)
- Wire admin chat panel to a real admin assistant endpoint when available
- Replace dev autofill dropdown with catalog registry imports

## Open Questions

- Whether `/admin/add` should share the same `AdminChatLayout` wrapper (currently only main `/admin` route)
- Title-only matching vs shipping `catalog_key` on API in the first implementation slice

## Architecture Decisions

- Chat state stays in client hooks (`useAdminChatLayout`, `useStaticAdminChat`); route remains server-only for auth and data fetch
- Panel is a fixed right overlay (`max-w-md`) with local static responses until backend exists

## Session Notes

- Feature lives at `apps/app/features/admin-chat-layout/` per `02-admin-chat-layout.md` spec
