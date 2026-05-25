# Feature: problem chat session header

## Goal

Add a chat session header to the problem workspace chat panel that lets a learner start a new chat, view previous chats, switch between chats, and preserve chat history per problem.

This feature extends the existing `features/problem-workspace/chat-panel/` implementation. It must not create a second chat panel or replace the current streaming/message UI work.

---

## V1 scope (deployment target)

**Ship through Stage 5.** That delivers persisted multi-thread chat with header, history dropdown, new chat, thread switching, and streaming to the active thread.

| Stage | Status | What it delivers |
| ----- | ------ | ---------------- |
| 1 | Shipped | Fixed header UI |
| 2 | Shipped | Local `+` clear (temporary until Stage 5) |
| 3 | Shipped | History dropdown shell (empty list) |
| 4 | Shipped | Backend: multi-thread persistence (extend existing APIs) |
| 5 | Shipped | Frontend: wire threads per **V1 simplifications** (lazy history, messages bootstrap) |
| 6 | Post-v1 | Problem workspace Radix hydration (dev console warnings) |

**Post-v1 (do not implement in this feature slice):** new-chat confirmation dialog, server-stored “last active thread”, stored thread titles, toasts, cross-device active-thread restore, delete/archive UX beyond “leave old thread in history”, **Radix `useId` hydration mismatch fixes** (Stage 6).

---

## Existing context

### Frontend (chat-panel)

- persisted chat history via `use-problem-chat.ts`
- streaming tutor replies via BFF `/api/problems/[problemId]/chat/stream`
- message UI in `chat-shell.tsx` and related components
- **Stages 1–3 shipped:** `ChatHeader`, history `Popover`, `ChatSessionHistory`, local `clearVisibleChat()`

### Backend (today)

- `problem_chat_thread` and `problem_chat_message` tables already exist
- **Constraint today:** one thread per `(userId, problemId)` — unique index on that pair
- `getOrCreateThread()` always resolves the same row for a user on a problem
- `GET /problems/:problemId/chat/messages` already returns `{ thread, messages }`
- Stream: `POST /problems/:problemId/chat/messages/stream`
- App reads history via **server actions** (not BFF); stream uses **BFF**

V1 must **relax the one-thread constraint** and extend these paths — not add a parallel REST surface.

---

## Architecture (v1)

### Mental model

```txt
Problem
  ├── Thread A
  │    ├── Message 1
  │    └── Message 2
  ├── Thread B
  │    └── Message 1
  └── Thread C
```

The **active thread** (client state) controls which messages are shown and where new streamed messages are saved.

### New chat (v1 behavior)

```txt
Click +
→ POST create empty thread
→ set activeThreadId to new thread
→ messages empty
→ future sends include threadId
→ old thread remains in history dropdown
```

### Simpler API shape (prefer extend over duplicate)

| Need | V1 approach |
| ---- | ----------- |
| List threads for history | **New** `GET …/chat/threads` — summaries only |
| Create empty thread | **New** `POST …/chat/threads` |
| Load thread + messages | **Extend** `GET …/chat/messages?threadId=` — omit `threadId` → most recently updated thread for user+problem |
| Send / stream | **Extend** existing POST bodies with `threadId` — required once Stage 5 ships |

Do **not** add a separate `GET …/chat/threads/[threadId]` if `GET …/chat/messages?threadId=` already returns `{ thread, messages }`.

Do **not** add Next BFF routes for list/load/create unless there is a concrete need — use **server actions** matching existing chat-panel patterns. Keep BFF for stream only.

### Thread summaries (computed in v1)

`ProblemChatSessionSummary` for the UI:

```ts
export type ProblemChatSessionSummary = {
  id: string;
  title: string | null;       // null in v1 → UI shows "Untitled chat"
  preview: string | null;     // latest user message, truncated (~80 chars), or null
  createdAt: string;
  updatedAt: string;
  messageCount: number;
};
```

Compute `messageCount`, `updatedAt`, and `preview` in the list query — **no title column migration in v1**.

### Active thread (client-only in v1)

- `activeThreadId` lives in React / TanStack Query (via `use-chat-sessions.ts`)
- Optional `localStorage` restore is post-v1
- On first load with no active id: use latest thread from list or create one on first send

---

## Frontend behavior overview

1. **`ChatHeader`** — title, `+`, history button → `Popover` dropdown
2. **`ChatSessionHistory`** — dropdown body: loading / empty / session rows
3. **`ChatShell` / message area** — messages for active thread; streaming unchanged in UX

---

## Target frontend component structure

```txt
apps/app/features/problem-workspace/chat-panel/
  components/
    chat-shell.tsx
    chat-header.tsx                 # header + history Popover trigger
    chat-session-history.tsx        # dropdown list content
    chat-session-history-item.tsx
  hooks/
    use-problem-chat.ts             # messages + stream; accepts activeThreadId (Stage 5)
    use-chat-sessions.ts            # list / create / select threads (Stage 5)
  lib/
    chat-session-types.ts
    problem-chat-types.ts           # extend with threadId on send types (Stage 5)
```

Do not create `chat-panel-v2/`, `chatbot/`, or duplicate chat folders.

---

## Stage 1 — Frontend header only ✅ Shipped

Add `ChatHeader` fixed at top of `ChatShell`. UI only; no backend changes.

### Acceptance criteria

- [x] `ChatHeader` exists.
- [x] Header fixed above scrolling messages.
- [x] Message list, input, and streaming unchanged.
- [x] No backend changes.

---

## Stage 2 — Local new chat UX ✅ Shipped (temporary)

`+` calls `clearVisibleChat()`, clears draft and votes. **Replaced in Stage 5** by real thread creation.

```ts
// Temporary Stage 2 behavior. Real new chat will create and switch to a persisted thread.
```

### Acceptance criteria

- [x] `+` clears visible messages locally.
- [x] Input and streaming still work.
- [x] No backend changes.

---

## Stage 3 — Frontend history shell ✅ Shipped

History list in a **dropdown** (`Popover` on history button in `ChatHeader`). Empty `sessions={[]}` until Stage 5.

### Acceptance criteria

- [x] History opens/closes as dropdown.
- [x] Empty state: `No previous chats yet`.
- [x] `ChatSessionHistoryItem` exists.
- [x] No backend dependency.

---

## Stage 4 — Multi-thread persistence (backend)

### Goal

Enable multiple persisted threads per user per problem. Extend existing Nest routes and app server layer — minimal new surface area.

### 4a. Schema migration

- Drop unique index `problem_chat_thread_user_problem_unique` on `(user_id, problem_id)`.
- Existing rows become valid first entries in history — no data loss.
- Update schema comment: many threads per `(user, problem)`.

### 4b. Nest service changes

Replace implicit-only `getOrCreateThread(userId, problemId)` with:

- `listThreads(userId, problemId)` → summaries (`id`, `createdAt`, `updatedAt`, `messageCount`, `preview`)
- `createThread(userId, problemId)` → new empty thread row
- `getThreadMessages(userId, problemId, threadId?)` → if `threadId` omitted, use latest by `updatedAt`; verify ownership
- `resolveThreadForSend(userId, threadId)` → validate thread belongs to user+problem before persist/stream

Stop upserting a single thread on every message send once Stage 5 passes explicit `threadId`.

### 4c. Nest routes

```txt
GET  /problems/:problemId/chat/threads          # list summaries
POST /problems/:problemId/chat/threads          # create empty thread
GET  /problems/:problemId/chat/messages?threadId=   # extend existing route
POST /problems/:problemId/chat/messages/stream  # extend body: threadId (required in Stage 5)
```

Responses:

```ts
type GetProblemChatThreadsResponse = {
  threads: ProblemChatSessionSummary[];
};

type CreateProblemChatThreadResponse = {
  thread: ProblemChatSessionSummary;
};

// Existing shape — unchanged
type GetProblemChatMessagesResponse = {
  thread: ProblemChatThreadDto;
  messages: ProblemChatMessageDto[];
};
```

### 4d. App access layer

Add server actions in `chat-panel/actions/` (mirror existing `getProblemChatMessagesAction` pattern):

- `listProblemChatThreadsAction(problemId)`
- `createProblemChatThreadAction(problemId)`
- Extend `getProblemChatMessagesAction(problemId, threadId?)`

Extend stream BFF + Nest stream handler to accept `threadId` in the request body (wire fully in Stage 5; schema/types can land in Stage 4).

### Auth

Same as existing chat: `ProblemsUserGuard`, bearer/session via app auth helpers.

### Acceptance criteria

- [x] Migration applied; multiple threads per user+problem allowed.
- [x] Existing single-thread conversations still load (appear in thread list).
- [x] `GET …/chat/threads` returns summaries with `messageCount` and `preview`.
- [x] `POST …/chat/threads` creates an empty thread.
- [x] `GET …/chat/messages?threadId=` returns correct messages; omitting id returns latest thread.
- [x] Unauthorized / wrong-user thread access returns friendly errors.
- [x] Server actions callable from `apps/app`; no unnecessary new BFF routes.
- [x] Stream request body accepts optional `threadId` (wired fully in Stage 5).

---

## Stage 5 — Wire frontend (completes v1)

### Goal

Connect header, history dropdown, and `useProblemChat` to real threads. Remove Stage 2 local-only reset.

Keep v1 **minimal**: one bootstrap path, lazy history fetch, no extra persistence layers.

---

### V1 simplifications (prefer these over heavier patterns)

#### 1. Bootstrap active thread from messages only (not from thread list)

On mount, do **not** require `GET …/chat/threads` to render chat.

1. Call existing `getProblemChatMessages(problemId)` with **no** `threadId` (latest thread; API creates one if needed).
2. Set `activeThreadId` from `response.thread.id`.
3. Hydrate `useChat` from `response.messages`.

Thread list is **not** on the critical path for first paint.

#### 2. Lazy-load history when the dropdown opens

Fetch `listProblemChatThreads` only when `historyOpen` becomes `true` (TanStack Query `enabled: historyOpen`).

Benefits:

- avoids mount race between list + messages
- fewer requests when the user never opens history
- list can include **all** threads (including active) — no special empty state when only one thread exists

After `+` or `onFinish`, invalidate the threads query **if it has been fetched** (or refetch when dropdown next opens).

#### 3. Reset shell UI state on thread change

On **`createNewThread`** and **`selectThread`**, reset the same local state as Stage 2 `+`:

- clear draft input (`editDraft` + `editDraftKey`)
- clear `votes`

Do not carry votes or draft across threads.

#### 4. Single orchestration owner

`use-chat-sessions.ts` owns `activeThreadId`, list/create/select, and lazy list query.

`use-problem-chat.ts` accepts `activeThreadId` and handles messages/stream only — it does **not** fetch the thread list.

`ChatShell` composes both; avoid a third parallel source of thread state.

#### 5. Known v1 limitation (document, do not fix in Stage 5)

After **full page refresh**, active thread resets to **latest by `updatedAt`** (no `localStorage`, no server “last active”). Acceptable for v1.

---

### Non-negotiable implementation checklist

Stage 5 is not done unless all of these are addressed:

| Item | Why |
| ---- | --- |
| Hydration keyed by **`problemId` + `activeThreadId`** (not `problemId` alone) | Without this, history select on the same problem may not swap messages |
| Stream send includes **`threadId`** in upstream body | Without this, messages save to latest server thread while UI shows another |
| `onFinish` refetches **`getProblemChatMessages(problemId, activeThreadId)`** | Without this, wrong messages can reappear after stream |
| `onFinish` invalidates **`problemChatKeys.threads(problemId)`** when list was loaded | Keeps preview/count fresh in dropdown |
| `useChat({ id: \`${problemId}:${activeThreadId}\` })` with stable id only when `activeThreadId` is set | Resets chat state cleanly on thread switch |

---

### New hook: `use-chat-sessions.ts`

```ts
type ChatSessionState = {
  activeThreadId: string | null;
  setActiveThreadId: (threadId: string) => void;
  threads: ProblemChatSessionSummary[];
  isLoadingThreads: boolean;
  historyEnabled: boolean; // true when dropdown open — drives lazy list query
  openHistory: () => void;   // optional helper; or pass historyOpen from shell
  createNewThread: () => Promise<void>;
  selectThread: (threadId: string) => Promise<void>;
};
```

- **`createNewThread`** → `POST` create → set `activeThreadId` → empty messages (via callback into `useProblemChat` or shared setter) → close dropdown → invalidate threads query if loaded.
- **`selectThread`** → set `activeThreadId` → `useProblemChat` hydration loads messages → close dropdown → reset draft/votes in shell.
- **Remove** `clearVisibleChat()` from the `+` path.

Thread list query:

```ts
useQuery({
  queryKey: problemChatKeys.threads(problemId),
  queryFn: () => listProblemChatThreads(problemId),
  enabled: Boolean(problemId) && historyEnabled,
});
```

---

### `use-problem-chat.ts` changes

- Accept `activeThreadId: string | null` and `onActiveThreadResolved?: (threadId: string) => void` for bootstrap.
- **Bootstrap query** (no `threadId`) runs once when `problemId` is set and `activeThreadId` is null; on success call `onActiveThreadResolved(response.thread.id)`.
- **Messages query** runs when `activeThreadId` is set: `getProblemChatMessages(problemId, activeThreadId)`.
- `useChat({ id: activeThreadId ? \`${problemId}:${activeThreadId}\` : \`pending:${problemId}\` })` — disable send until `activeThreadId` is set.
- Hydration ref tracks **`${problemId}:${activeThreadId}`**, not `problemId` alone.
- `onFinish`: refetch active thread + invalidate threads list key.
- Stream transport / send path includes `threadId: activeThreadId` in body (verify `DefaultChatTransport` body hook for `@ai-sdk/react`).

---

### `chat-shell.tsx` wiring

- Pass `historyOpen` / `onHistoryOpenChange`; set `historyEnabled = historyOpen` for lazy list.
- Pass `historySessions={threads}`, `historyLoading`, `activeSessionId={activeThreadId}`, `onSelectSession={selectThread}`, `onNewChat={createNewThread}`.
- Reset draft/votes in shell callbacks wrapping create/select (or inside hook if shell state moved later).

---

### V1 UX rules

- `+` creates persisted thread immediately — **no confirmation dialog**.
- History dropdown closes on select, outside click, Escape, or new chat.
- `title` null → `ChatSessionHistoryItem` shows “Untitled chat”.
- History list shows **all** threads for the problem (including the active one).

### Acceptance criteria

- [x] Bootstrap: chat loads via latest messages; `activeThreadId` set from response.
- [x] Thread list fetched **only when** history dropdown opens.
- [x] `+` creates a real thread and shows empty chat.
- [x] History lists threads with preview/count; select loads that thread’s messages.
- [x] Streaming saves to the active thread (`threadId` on send).
- [x] No message leak across threads in one session (hydration + `useChat` id checklist above).
- [x] Draft and votes reset on new chat and thread select.
- [x] Stage 2 `clearVisibleChat` no longer used for `+`.
- [x] Page refresh loads latest thread (known v1 limitation).
- [x] `pnpm typecheck` passes for `apps/app`.

---

## Stage 6 — Problem workspace hydration (post-v1)

### Goal

Reduce or eliminate dev **React hydration mismatch** warnings from Radix UI (`aria-controls`, `data-panel-id`, etc.) on `/problems/[slug]`. These are noisy in dev; functionality usually still works.

### Do not do (failed / invalid in Next.js App Router)

- `next/dynamic({ ssr: false })` **inside a Server Component** (e.g. `app/problems/[slug]/page.tsx`) — build error in Next 16: *"`ssr: false` is not allowed with `next/dynamic` in Server Components"*.
- `suppressHydrationWarning` on root `layout` — does **not** suppress descendant attribute mismatches.

### Valid approaches (pick one when implementing Stage 6)

1. **Client wrapper component** — `"use client"` file that calls `dynamic(..., { ssr: false })` and is imported from the server page (thin server page stays valid).
2. **`mounted` gate** inside existing client components (e.g. defer entire `Sheet` in nav-drawer, or workspace shell) — plain HTML until `useEffect`, then mount Radix tree.
3. **Investigate root cause** — compare prod vs dev (Turbopack), rule out browser extensions, audit conditional trees that change `useId` order.

### Acceptance criteria

- [ ] `pnpm build` passes.
- [ ] No hydration mismatch warnings on problem workspace load in dev (or documented residual cases).
- [ ] Problem workspace and nav drawer remain fully functional.

**Not part of Stage 5.** Do not block v1 chat threads on this work.

---

## V1 testing checklist

### Frontend

- [ ] Chat loads on open without waiting for thread list (bootstrap via latest messages).
- [ ] Thread list loads only when history dropdown opens.
- [ ] Header renders; history dropdown opens/closes.
- [ ] `+` creates new empty persisted chat; draft/votes cleared.
- [ ] History shows all threads; select switches messages and clears draft/votes.
- [ ] Input and streaming work after thread switch; stream uses active `threadId`.
- [ ] Full page refresh loads latest thread (expected v1 behavior).

### Backend

- [ ] Thread list / create / messages require auth.
- [ ] User cannot access another user's thread.
- [ ] Invalid `threadId` returns friendly error.
- [ ] Legacy users with one thread see it in history.

### Regression

- [ ] Existing message UI actions (copy, edit, vote) still work.
- [ ] Streaming still token-by-token.
- [ ] No duplicate chat-panel implementations.

---

## Out of scope

**Product (not v1):**

- deleting chat history permanently
- new-chat confirmation dialog
- cross-problem chat history
- pinned chats, folders, export, share
- AI summaries of old chats
- vector memory / tutor prompt changes
- server-persisted “last active thread per problem”
- stored thread title column (computed preview only in v1)

**Technical (not v1):**

- `GET …/chat/threads/[threadId]` as a separate route
- BFF routes for thread list/load (use server actions)
- `clear-chat-dialog.tsx` (post-v1)
- Eager thread-list fetch on every chat mount (use lazy load on dropdown open)
- `localStorage` / server persistence of last active thread per problem
- Stage 6 Radix hydration fixes (see Stage 6 — use client wrapper, not `dynamic` in server page)

---

## Implementation guidance for agents

1. Stages 1–4 are **done** — do not redo unless fixing bugs.
2. Implement **Stage 5** as one frontend slice following **V1 simplifications** above; remove Stage 2 temporary `+` behavior.
3. **Stage 6** (hydration) is post-v1 — do not mix into Stage 5.
4. Read existing `apps/api/src/problem-chat/` and `apps/app/features/problem-workspace/chat-panel/` before changing behavior.
5. Do not create parallel chat folders.
6. Run `pnpm typecheck` from `apps/app` when touching types.
7. Update `progress-tracker.md` when a stage ships.

**Do not implement post-v1 items** unless the user explicitly expands scope.
