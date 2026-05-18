# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete

## Current Goal

- Admin chat layout with static local chatbot (no API yet)

## Completed

- `admin-chat-layout` feature: global header with Ask AI toggle, right slide-out panel, static message list/input, hooks for panel and chat state
- Admin route wraps `AdminPageShell` in `AdminChatLayout`

## In Progress

- None yet.

## Next Up

- Wire admin chat panel to a real admin assistant endpoint when available

## Open Questions

- Whether `/admin/add` should share the same `AdminChatLayout` wrapper (currently only main `/admin` route)

## Architecture Decisions

- Chat state stays in client hooks (`useAdminChatLayout`, `useStaticAdminChat`); route remains server-only for auth and data fetch
- Panel is a fixed right overlay (`max-w-md`) with local static responses until backend exists

## Session Notes

- Feature lives at `apps/app/features/admin-chat-layout/` per `02-admin-chat-layout.md` spec
