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
| 4 | Next | Backend: multi-thread persistence (extend existing APIs) |
| 5 | Next | Frontend: wire threads, replace Stage 2 hack, pass `threadId` on stream |

**Post-v1 (do not implement in this feature slice):** new-chat confirmation dialog, server-stored “last active thread”, stored thread titles, toasts, cross-device active-thread restore, delete/archive UX beyond “leave old thread in history”.

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

- [ ] Migration applied; multiple threads per user+problem allowed.
- [ ] Existing single-thread conversations still load (appear in thread list).
- [ ] `GET …/chat/threads` returns summaries with `messageCount` and `preview`.
- [ ] `POST …/chat/threads` creates an empty thread.
- [ ] `GET …/chat/messages?threadId=` returns correct messages; omitting id returns latest thread.
- [ ] Unauthorized / wrong-user thread access returns friendly errors.
- [ ] Server actions callable from `apps/app`; no unnecessary new BFF routes.

---

## Stage 5 — Wire frontend (completes v1)

### Goal

Connect header, history dropdown, and `useProblemChat` to real threads. Remove Stage 2 local-only reset.

### New hook: `use-chat-sessions.ts`

```ts
type ChatSessionState = {
  activeThreadId: string | null;
  threads: ProblemChatSessionSummary[];
  isLoadingThreads: boolean;
  createNewThread: () => Promise<void>;
  selectThread: (threadId: string) => Promise<void>;
};
```

- Load thread list on mount (TanStack Query).
- `createNewThread` → `POST` create + set active + empty messages.
- `selectThread` → `GET messages?threadId=` + hydrate `useChat` + close dropdown.
- **Remove** `clearVisibleChat()` from user-facing `+` path (delete or keep internal only).

### `use-problem-chat.ts` changes

- Accept `activeThreadId` (required once sessions hook is wired).
- `useChat({ id: \`${problemId}:${activeThreadId}\` })` so switching threads resets chat state cleanly.
- History query keyed by `problemId` + `activeThreadId`.
- `onFinish`: refetch active thread messages + invalidate thread list (updates `preview` / `messageCount`).
- Stream transport sends `threadId` in body.

### `chat-shell.tsx` wiring

Pass real `historySessions`, `activeSessionId`, `historyLoading`, `onSelectSession`, and `onNewChat={createNewThread}` into `ChatHeader`.

### V1 UX rules

- `+` creates persisted thread immediately — **no confirmation dialog in v1**.
- History dropdown closes on select, outside click, Escape, or new chat.
- `title` null → `ChatSessionHistoryItem` shows “Untitled chat”.

### Acceptance criteria

- [ ] `+` creates a real thread and shows empty chat.
- [ ] History lists prior threads with preview/count.
- [ ] Selecting a thread loads its messages.
- [ ] Streaming saves to the active thread.
- [ ] Page refresh reloads latest thread if no client active id (acceptable v1); messages never leak across threads in one session.
- [ ] Stage 2 `clearVisibleChat` no longer used for `+`.
- [ ] `pnpm typecheck` passes for `apps/app` (fix pre-existing errors if they block CI).

---

## V1 testing checklist

### Frontend

- [ ] Header renders; history dropdown opens/closes.
- [ ] `+` creates new empty persisted chat.
- [ ] History shows previous threads; select switches messages.
- [ ] Input and streaming work after thread switch.
- [ ] Empty history state when only one thread exists (or copy TBD: show current thread vs empty — prefer listing all threads including active).

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

**Technical:**

- `GET …/chat/threads/[threadId]` as a separate route
- BFF routes for thread list/load (use server actions)
- `clear-chat-dialog.tsx` (post-v1)

---

## Implementation guidance for agents

1. Stages 1–3 are **done** — do not redo unless fixing bugs.
2. Implement **Stage 4** (backend + server actions + stream body types) before Stage 5.
3. Implement **Stage 5** as one frontend slice; remove Stage 2 temporary `+` behavior.
4. Read existing `apps/api/src/problem-chat/` and `apps/app/features/problem-workspace/chat-panel/` before changing behavior.
5. Do not create parallel chat folders.
6. Run `pnpm typecheck` from `apps/app` when touching types.
7. Update `progress-tracker.md` when a stage ships.

**Do not implement post-v1 items** unless the user explicitly expands scope.
