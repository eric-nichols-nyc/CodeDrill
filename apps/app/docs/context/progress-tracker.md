# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Admin catalog shipped (v1); optional catalog_key API next

## Current Goal

- [Stage 7 — Practice BFF migration](../features-spec/clerk-neon-auth/07-practice-bff-migration.md) — `app/api/*` + chat actions off Better Auth cookie

## Session Notes

- **Clerk E2E verified:** `/account` loads Neon profile via `GET /api/me` (Clerk JWT + webhook-provisioned `user` row). Spec: `clerk-neon-auth/07-practice-bff-migration.md`.

## Completed

- Clerk Stage 3 — `nest-clerk-api` `POST /api/webhooks/clerk` (`webhooks.service.ts`): upsert on `user.created` / `user.updated` / `session.created`, delete on `user.deleted`
- Clerk Stage 2 — `@clerk/nextjs`, `(unauthenticated)` `/sign-in` + `/sign-up`, `proxy.ts` + `clerkMiddleware` (`/account`, `/admin`), `ClerkProvider`, `getNestClerkMe()` on `/account`, Option A hybrid (Better Auth BFF for `apps/api`)
- Auth feature spec `14-auth.md` + tutor chat sign-in gate (`useApiAuth`, `TutorSignInPrompt`, `ChatShell` unsigned/pending states)
- Admin AI problem form generation Stage 4 — success message, dirty overwrite confirm (`AlertDialog`), prompt max length + counter; `isProblemFormDirty`; server prompt length guard
- Admin AI problem form generation — moved OpenAI to Nest `POST /problems/generate`; Next BFF proxies; `OPENAI_API_KEY` only on `apps/api`
- Problem chat starter suggestions Stage 1 — static empty-thread chips (`chat-suggestions.tsx`, `problem-chat-starter-suggestions.ts`); click sends via stream path; visibility gated on empty thread + loaded history
- Problem chat session header Stage 5 — `use-chat-sessions.ts` + thread-aware `use-problem-chat.ts`; lazy history list; `+` creates persisted thread; stream sends `threadId`; hydration keyed by `problemId:activeThreadId`
- Problem chat session header Stage 4 — multi-thread API: migration drops `(user, problem)` unique index; Nest `GET/POST …/chat/threads`; extended `GET messages?threadId=` + optional `threadId` on stream POST; server actions + types
- Problem chat session header spec v1 rewrite — simpler API (extend `GET messages`, two thread routes, server actions); Stages 1–3 shipped; v1 stops at Stage 5
- Problem chat session header Stage 3 — history dropdown on header button (`Popover` + `ChatSessionHistory`); empty state
- Problem chat session header Stage 2 — `+` clears visible messages, draft input, and votes locally via `clearVisibleChat()`; streaming unchanged until persisted threads (Stage 4/5)
- Problem chat session header Stage 1 — `ChatHeader` fixed at top of `chat-panel` shell; + / history placeholder actions; spec paths updated to `chat-panel/components`
- `nav-drawer` list UI — `/problems` toolbar parity (search, filter, sort, random); zebra rows; white active row; semibold text; sheet mounts content only when open (hydration fix)
- Problem chat streaming Stage 1 — Nest `POST /problems/:problemId/chat/messages/stream` (SSE text-delta + finish); blocking POST unchanged
- Problem chat streaming Stage 2 — Next BFF `/api/problems/[problemId]/chat/stream` wraps Nest SSE as AI SDK UI message stream
- Problem chat streaming Stage 3 — `useChat` send path + streaming `chat.tsx` (history via TanStack, send via BFF stream)
- API auth consolidation — Nest bearer plugin + app Better Auth client; sign-in/up at `/auth/*`; Bearer on BFF/actions; Neon Auth removed
- Practice API deployed on Render (`https://nestjs-backend-vxu2.onrender.com`) — documented in `apps/api/README.md` Deploy + `architecture.md` Environments
- API auth consolidation (API slice) — bearer plugin, `getSessionFromHeaders`, removed `x-user-id` guard path
- Problem chat V1 UI — Server Actions + TanStack Query in `features/problem-workspace/chatbot/`; history load, send message, markdown assistant replies; `problemId` wired through sidebar
- Problem chat message UI round 2 — split `chat-shell`, `message-list`, `message`, `message-thinking`, `message-actions`, `chat-input`; Shimmer thinking row; copy/edit/vote actions (votes client-only)
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
- **Auth:** Nest API is the sole auth authority — Better Auth bearer plugin; app uses `better-auth/react` client via `/api/auth/*` proxy; Bearer cookie for server BFF/actions

## Session Notes

- Problem chat starter suggestions Stage 1 shipped — spec `13-problem-chat-starter-suggestions.md`
- Stage 5 spec includes v1 simplifications: bootstrap from latest messages only; lazy thread list on history open; explicit hydration/stream checklist
- Stage 6 (post-v1): Radix hydration on problem page — use client wrapper for `dynamic({ ssr: false })`, not server `page.tsx`; attempted fix reverted (Next 16 build error)
- Problem chat UI spec: `docs/context/features-spec/07-problem-chat-ui.md`; backend reference in `docs/context/features-spec/ai/problem-chat/`
- Problem chat streaming V2 spec: `docs/context/features-spec/09-problem-chat-streaming.md` — refactor existing chatbot in 3 stages (API → BFF → client); round 1 skips UI restructure and Framer Motion
- Problem chat message UI: `docs/context/features-spec/10-problem-chat-message-ui.md` — component split + thinking + actions
