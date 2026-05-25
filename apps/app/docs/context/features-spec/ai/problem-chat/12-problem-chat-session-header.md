# Feature: problem chat session header

## Goal

Add a chat session header to the problem workspace chat panel that lets a learner start a new chat, view previous chats, switch between chats, and preserve chat history per problem.

This feature extends the existing `features/problem-workspace/chat-panel/` implementation. It must not create a second chat panel or replace the current streaming/message UI work.

---

## Existing context

The current chat panel already has:

- persisted chat history
- streaming tutor replies
- message UI components
- a `use-problem-chat.ts` hook
- a chat shell rendered inside the problem workspace sidebar/panel

This feature adds session controls above the existing chat area.

The final UI should roughly look like:

```txt
┌─────────────────────────────────────┐
│ ✦ Leet                         ⛶  < │
├─────────────────────────────────────┤
│                           +   ⟳/history │
├─────────────────────────────────────┤
│                                     │
│             chat messages            │
│                                     │
├─────────────────────────────────────┤
│             chat input               │
└─────────────────────────────────────┘
```

The header is responsible for session actions. The existing chat body remains responsible for messages and streaming.

---

## Important architecture decision

A “new chat” should eventually create a real persisted thread/session.

It should not only clear local React state.

Bad final behavior:

```txt
Click + New Chat
→ UI clears
→ refresh page
→ old messages come back
```

Correct final behavior:

```txt
Click + New Chat
→ create Thread B
→ switch activeThreadId to Thread B
→ messages are empty
→ future streamed messages persist to Thread B
→ history can reopen Thread A later
```

Mental model:

```txt
Problem
  ├── Thread A
  │    ├── Message 1
  │    └── Message 2
  ├── Thread B
  │    └── Message 1
  └── Thread C
```

The active thread controls what messages are shown and where new streamed messages are saved.

---

## Frontend behavior overview

The frontend should have three visible areas:

1. `ChatHeader`
   - Shows chat title/app label
   - New chat button
   - History button
   - Optional collapse/expand button if the parent panel supports it

2. `ChatSessionHistory`
   - Opens from the history button
   - Lists previous threads for the current problem
   - Clicking a thread switches the active chat

3. Existing `ChatShell` / message area
   - Renders messages for the active thread
   - Sends messages using existing streaming path
   - Keeps message UI actions unchanged

---

## Target frontend component structure

Keep this inside the existing chat-panel feature folder.

```txt
apps/app/features/problem-workspace/chat-panel/
  components/
    chat-shell.tsx                 # existing shell, updated to include ChatHeader
    chat-header.tsx                # new header UI (fixed at top of chat)
    chat-session-history.tsx       # history popover/panel
    chat-session-history-item.tsx  # single thread row
    clear-chat-dialog.tsx          # optional confirmation dialog

  hooks/
    use-problem-chat.ts            # existing hook, later extended with active thread support
    use-chat-sessions.ts           # loads/creates/switches threads

  lib/
    chat-session-types.ts          # thread/session types
```

Do not create:

```txt
chat-panel-v2/
new-chat-panel/
session-chat-panel/
chatbot/                           # legacy duplicate folder — use chat-panel only
```

This is a refactor/extension of the existing chat panel.

---

## Stage 1 — Frontend header only

### Goal

Add the visible chat header UI and wire it into the existing chat shell without changing backend behavior.

This stage is intentionally UI-only.

### What to build

Create:

```txt
apps/app/features/problem-workspace/chat-panel/components/chat-header.tsx
```

Update:

```txt
apps/app/features/problem-workspace/chat-panel/components/chat-shell.tsx
```

so the header is **fixed at the top of the chat** (does not scroll with messages) and appears above the existing message list.

### `ChatHeader` responsibilities

The component should render:

- left title area, for example `Leet`
- new chat button with plus icon
- history button with clock/history icon
- optional collapse button prop, but do not implement layout collapse unless already available

### Suggested props

```ts
type ChatHeaderProps = {
  title?: string;
  onNewChat?: () => void;
  onOpenHistory?: () => void;
  onCollapse?: () => void;
  isHistoryOpen?: boolean;
};
```

### UI rules

- Use `@repo/design-system` primitives when available.
- Use `lucide-react` icons only.
- Use semantic tokens like `bg-background`, `border-border`, `text-muted-foreground`.
- Do not hardcode bright custom colors.
- Pin the header at the top of the chat shell (`shrink-0`; message list scrolls below).
- Do not change message rendering.
- Do not change streaming behavior.
- Do not touch Nest/API in this stage.

### Temporary behavior

For Stage 1:

- `onNewChat` can be a placeholder callback.
- `onOpenHistory` can toggle a placeholder history panel or log locally.
- The point is to land the header safely first.

### Acceptance criteria

- [ ] `ChatHeader` exists.
- [ ] `ChatShell` renders `ChatHeader` fixed above messages (header stays visible while scrolling).
- [ ] Existing message list still renders.
- [ ] Existing chat input still works.
- [ ] Existing streaming behavior is unchanged.
- [ ] No backend files are modified.
- [ ] `pnpm typecheck` passes for `apps/app`.

### Cursor prompt for Stage 1

```txt
Implement Stage 1 of `12-problem-chat-session-header.md`.

Read the existing chat-panel files under:
`apps/app/features/problem-workspace/chat-panel/`

Add a new `chat-header.tsx` component under:
`apps/app/features/problem-workspace/chat-panel/components/`

Then update the existing `chat-shell.tsx` so the header is fixed at the top, above the existing message list/input area.

Important constraints:
- UI only for Stage 1.
- Do not change streaming behavior.
- Do not modify Nest/API routes.
- Do not create a duplicate chat-panel folder.
- Use design-system tokens and lucide-react icons.
- Keep existing message UI and input behavior unchanged.
- Run `pnpm typecheck` for `apps/app`.
```

---

## Stage 2 — Local new chat UX

### Goal

Make the `+` button clear the visible chat locally so the UX can be tested before persisted threads are added.

This is a temporary frontend-only version of new chat.

### Frontend behavior

Clicking `+` should:

1. clear visible messages in the current `useChat` state
2. clear the draft input if possible
3. show the existing empty chat state

### Important warning

This is not the final implementation.

Until Stage 3/4 exist, refreshing may reload the old persisted thread.

Add a code comment near the local reset explaining:

```ts
// Temporary Stage 2 behavior. Real new chat will create and switch to a persisted thread.
```

### Acceptance criteria

- [ ] New chat button clears visible messages.
- [ ] Empty chat state appears.
- [ ] Input remains usable.
- [ ] Sending a new message still streams.
- [ ] No backend changes yet.

---

## Stage 3 — Frontend history shell

### Goal

Add the frontend history UI without real API integration yet.

This gives the component structure before backend thread endpoints exist.

### What to build

Create:

```txt
components/chat-session-history.tsx
components/chat-session-history-item.tsx
lib/chat-session-types.ts
```

### Temporary data

Use local mock data or an empty state only.

Do not fake complex behavior.

### Suggested type

```ts
export type ProblemChatSessionSummary = {
  id: string;
  title: string | null;
  preview: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
};
```

### UI behavior

History panel should support:

- loading state
- empty state: `No previous chats yet`
- list of sessions
- click handler prop for selecting a session

### Acceptance criteria

- [ ] History button opens/closes history UI.
- [ ] Empty state works.
- [ ] Session item component exists.
- [ ] No real backend dependency yet.

---

## Stage 4 — Persisted thread API

### Goal

Add real persisted chat session/thread support.

This is the first backend stage.

### Required routes

Add BFF routes in the Next app and matching Nest routes if they do not already exist.

```txt
GET  /api/problems/[problemId]/chat/threads
POST /api/problems/[problemId]/chat/threads
GET  /api/problems/[problemId]/chat/threads/[threadId]
```

### Route responsibilities

#### `GET /threads`

Returns session summaries for the problem.

```ts
type GetProblemChatThreadsResponse = {
  threads: ProblemChatSessionSummary[];
};
```

#### `POST /threads`

Creates a new empty thread for the problem.

```ts
type CreateProblemChatThreadResponse = {
  thread: ProblemChatSessionSummary;
};
```

#### `GET /threads/[threadId]`

Returns a specific thread and its messages.

```ts
type GetProblemChatThreadResponse = {
  thread: ProblemChatSessionSummary;
  messages: ProblemChatMessageDto[];
};
```

### Auth

Use the same auth pattern as the existing problem chat BFF/streaming routes.

### Acceptance criteria

- [ ] Thread list endpoint works.
- [ ] Create thread endpoint works.
- [ ] Get thread messages endpoint works.
- [ ] Unauthorized users cannot access routes.
- [ ] Existing default chat still works.

---

## Stage 5 — Active thread state

### Goal

Make the frontend aware of the active chat thread.

### Hook behavior

Add or extend hooks so the chat UI has:

```ts
type ChatSessionState = {
  activeThreadId: string | null;
  threads: ProblemChatSessionSummary[];
  isLoadingThreads: boolean;
  createNewThread: () => Promise<void>;
  selectThread: (threadId: string) => Promise<void>;
};
```

### New chat final behavior

Clicking `+` should:

1. call create thread endpoint
2. set the new thread as active
3. clear/hydrate messages for that active thread
4. close history panel
5. keep input ready for a new question

### Select history behavior

Clicking a previous thread should:

1. fetch that thread’s messages
2. set it as active
3. hydrate chat messages
4. close history panel

### Acceptance criteria

- [ ] `+` creates a real thread.
- [ ] History item switches active thread.
- [ ] Messages update when active thread changes.
- [ ] No duplicate messages after switching.

---

## Stage 6 — Streaming sends to active thread

### Goal

Ensure streamed messages persist to the selected thread.

### Required request change

The stream send body should include the active thread id:

```ts
type PostProblemChatMessageRequest = {
  content: string;
  threadId?: string;
  metadata?: {
    code?: string;
    language?: string;
  };
};
```

### Behavior

When a message is sent:

- if `activeThreadId` exists, persist/stream into that thread
- if no active thread exists, create or resolve a default thread before sending

### Acceptance criteria

- [ ] New messages save to the active thread.
- [ ] Switching threads before sending does not leak messages.
- [ ] Refresh shows messages under the correct thread.
- [ ] Streaming still works token-by-token.

---

## Stage 7 — Clear chat behavior

### Goal

Define the final clear/reset behavior.

### Recommended behavior

Do not permanently delete messages in v1.

Implement clear as:

```txt
Archive/leave current thread in history
+ create a new empty active thread
```

User-facing copy:

```txt
Start a new chat?
Your current conversation will remain in history.
```

### Optional component

```txt
components/clear-chat-dialog.tsx
```

### Acceptance criteria

- [ ] Clear/new chat does not destroy old history.
- [ ] New empty thread becomes active.
- [ ] Previous thread remains available in history.

---

## Stage 8 — Persistence polish

### Goal

Improve the production feel.

### Enhancements

- remember last active thread per problem
- update thread title from first user message
- show preview from first user message or latest message
- invalidate thread list after new messages
- handle missing/deleted thread gracefully
- add basic toast feedback for new chat / thread load failures

### Thread title rule

Default thread title:

```txt
First user message, truncated to around 40 characters
```

Example:

```txt
Can you explain two pointers...
```

### Acceptance criteria

- [ ] Thread title/preview updates after first message.
- [ ] Last active thread restores on refresh if possible.
- [ ] History list updates after messages are sent.

---

## Stage 9 — Testing checklist

### Frontend

- [ ] Header renders correctly.
- [ ] New chat button works.
- [ ] History opens/closes.
- [ ] Empty history state works.
- [ ] Selecting old thread hydrates messages.
- [ ] Input still works after switching threads.
- [ ] Streaming still animates correctly.

### Backend/API

- [ ] Thread list requires auth.
- [ ] Create thread requires auth.
- [ ] Get thread requires auth.
- [ ] User cannot access another user's thread.
- [ ] Invalid thread id returns a friendly error.

### Regression

- [ ] Existing persisted chat history still loads.
- [ ] Existing message UI actions still work.
- [ ] Existing streaming endpoint still works.
- [ ] No duplicate chat-panel implementations were created.
- [ ] `pnpm typecheck` passes.

---

## Out of scope

Do not implement in this feature:

- deleting chat history permanently
- cross-problem chat history
- pinned chats
- folders
- AI summaries of old chats
- exporting chats
- sharing chats
- vector memory
- new tutor prompt behavior

---

## Implementation guidance for agents

Start with Stage 1 only.

Do not jump to backend threads until the header is wired into the existing chat UI.

Each stage should preserve previous stages and keep the existing streaming/chat behavior working.

When implementing a stage:

1. Read this full spec.
2. Read the existing chat-panel files.
3. Implement only the requested stage.
4. Do not create parallel chat-panel folders.
5. Run typecheck.
6. Update progress docs if your project uses them.
