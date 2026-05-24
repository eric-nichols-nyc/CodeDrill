# Feature: problem-chat UI (problem-workspace chatbot)

## Goal

Wire the **problem page chat panel** to the existing Nest tutor API so signed-in users can load persisted thread history, send messages, and receive markdown assistant replies grounded in the current problem.

Backend persistence, tutor prompt, and OpenAI orchestration are **already implemented** in `apps/api/src/problem-chat/`. This spec covers the **V1 app UI slice** — colocated under `features/problem-workspace/chatbot/`.

## Reference

- [01-design-system.md](./01-design-system.md) — feature UI layout.
- [00-index.md](./00-index.md) — feature registry.
- [03-problem-progress.md](./03-problem-progress.md) — TanStack Query pattern for user-scoped server state.
- Backend & tutor behavior (read-only for UI work):
  - [ai/problem-chat/problem-chat-current-implementation.md](./ai/problem-chat/problem-chat-current-implementation.md)
  - [ai/problem-chat/tutor-behavior.md](./ai/problem-chat/tutor-behavior.md)
  - [ai/problem-chat/problem-context.md](./ai/problem-chat/problem-context.md)

## User story

As a signed-in learner on a problem page, I want to chat with an AI tutor about the problem I'm solving, so that I get hints and explanations that persist when I return.

---

## V1 Frontend Integration

The frontend uses the **existing problem chat Nest API** and keeps **server state in TanStack Query**.

### Data flow

1. **Load history:** `GET /problems/:problemId/chat/messages`
2. **Send message:** `POST /problems/:problemId/chat/messages`
3. **POST response** returns:
   - updated `thread`
   - saved `userMessage`
   - saved `assistantMessage`
4. UI appends returned messages to the chat (via TanStack cache update — no full refetch required).

### Frontend responsibilities

- Load chat history for the active `problemId`
- Render `user` and `assistant` messages (hide `system`)
- Send user messages to the POST route
- Append returned `userMessage` and `assistantMessage` to the UI
- Show loading state while sending
- Show error state if the request fails
- Keep draft input text locally in the client (PromptInput provider — not in TanStack)

### State ownership

#### TanStack Query (server state)

- Initial chat history fetch (`useQuery`)
- Send-message mutation (`useMutation`)
- Cache update after successful POST (`queryClient.setQueryData`)
- Loading and error state for server interactions

#### Local component / hook state (client-only)

- Draft input text (owned by `PromptInputProvider`)
- Panel open / close state (sidebar — already local)
- Transient UI: textarea focus, submit button status mapping

### Auth transport (server-side)

Client hooks call **`lib/problem-chat-api.ts`**, which invokes **Server Actions** that proxy to Nest with `upstreamUserHeaders()`. No Next BFF route (`app/api/.../chat/`) in V1.

Rationale: keep auth and upstream fetch server-side while colocating all chat logic in the feature folder. TanStack remains the client cache; actions are the transport layer behind the thin API helpers.

---

## V1 request / response shapes

### POST request

```ts
type PostProblemChatMessageRequest = {
  content: string;
  metadata?: {
    code?: string;
    language?: string;
  };
};
```

V1 sends `{ content }` only. `metadata.code` / `metadata.language` deferred (see out of scope).

### GET response

```ts
type GetProblemChatMessagesResponse = {
  thread: ProblemChatThreadDto;
  messages: ProblemChatMessageDto[];
};

type ProblemChatMessageDto = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};
```

### POST response

```ts
type PostProblemChatMessageResponse = {
  thread: ProblemChatThreadDto;
  userMessage: ProblemChatMessageDto;
  assistantMessage: ProblemChatMessageDto;
};
```

Types mirror `apps/api/src/problem-chat/problem-chat.types.ts`.

---

## File structure (V1)

```txt
apps/app/features/problem-workspace/chatbot/
  actions/
    problem-chat.actions.ts     # "use server" — client-callable entrypoints
  lib/
    problem-chat-types.ts       # DTOs (above)
    problem-chat-errors.ts        # NOT_SIGNED_IN, NETWORK, etc.
    problem-chat-keys.ts          # TanStack query keys
    problem-chat-server.ts        # server-only Nest fetch + auth
    problem-chat-api.ts           # thin helpers — NO TanStack logic
    parse-problem-chat-error.ts   # upstream error parsing
  hooks/
    use-problem-chat.ts           # TanStack Query integration (single hook)
  components/
    chat.tsx                      # presentational UI
```

No separate `queries/` folder in V1 — `use-problem-chat.ts` owns all TanStack wiring.

---

## File responsibilities

### `lib/problem-chat-api.ts`

Thin request helpers only. **Must not** contain TanStack Query logic.

Exports:

- `getProblemChatMessages(problemId)`
- `postProblemChatMessage(problemId, body)`

Implementation: delegate to Server Actions in `actions/problem-chat.actions.ts`.

### `lib/problem-chat-server.ts`

Server-only (`import "server-only"`). Resolves auth via `upstreamUserHeaders()`, fetches Nest at `problemsApiBaseUrl()`, validates JSON, throws typed `ProblemChatApiError`.

### `hooks/use-problem-chat.ts`

Owns all TanStack Query integration:

- `useQuery` for message history (`problemChatKeys.messages(problemId)`)
- `useMutation` for sending messages
- `onSuccess`: cache update — append `userMessage` + `assistantMessage`, set `thread`
- Expose to UI: `messages`, `isLoadingHistory`, `isSending`, `error`, `sendMessage`, `submitStatus`, `canSend`
- Filter `system` messages before exposing `messages`
- No retry on 401

### `components/chat.tsx`

Presentational only:

- Props: `problemId?: string`, optional `initialChatData` for prefetch
- Render message list, input, loading, error states
- Call `sendMessage` from hook
- **Assistant:** `MessageResponse` (markdown)
- **User:** plain text in `MessageContent`
- Uses `PromptInputSubmit` with `status` while sending

---

## Placement & wiring

- Chat lives in `ExpandableSidebarChat` → `ChatNotesTabs` → `ChatShell`.
- `problemId` (UUID) passed from `app/problems/[slug]/page.tsx` through sidebar into `Chat`.
- Without `problemId`: disabled empty state; no fetch.
- **Optional V1:** page prefetch via `getProblemChatMessages` → pass `initialChatData` to seed TanStack `initialData`.

| File | Change |
| ---- | ------ |
| `app/problems/[slug]/page.tsx` | Extract `problemId`; pass to sidebar |
| `expandable-sidebar-chat.tsx` | Forward `problemId` (+ optional initial chat data) |
| `chat-notes-tabs.tsx` | Forward to `ChatShell` |

---

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Nest API | `apps/api/src/problem-chat/` | **Shipped** |
| Server transport | `chatbot/actions/` + `chatbot/lib/problem-chat-server.ts` | Auth + upstream fetch |
| Thin API | `chatbot/lib/problem-chat-api.ts` | Client-callable helpers |
| TanStack | `chatbot/hooks/use-problem-chat.ts` | Server state cache |
| Feature UI | `chatbot/components/chat.tsx` | Render + local input |
| BFF | — | **None in V1** |

---

## Out of scope (V1)

- Next BFF route under `app/api/problems/.../chat/`
- Streaming responses
- Clickable starter prompt chips
- POST `metadata.code` / `metadata.language` (needs shared workspace context — V1.1)
- Admin chat wiring
- Nest / DB / tutor prompt changes

---

## Acceptance criteria

- [x] Spec registered in [00-index.md](./00-index.md).
- [x] `problemId` threaded page → sidebar → `Chat`.
- [x] Signed-in user: history loads; messages persist after refresh.
- [x] Send message: user bubble, loading state, assistant markdown reply from API.
- [x] Signed-out user: friendly non-blocking message; no crash.
- [x] `system` messages never rendered.
- [x] Placeholder `GENERIC_RESPONSE` removed from `chat.tsx`.
- [x] `lib/problem-chat-api.ts` has no TanStack imports.
- [x] `pnpm typecheck` passes for `apps/app`.

---

## Implementation prompt for agents

Implement V1 per this spec and [01-design-system.md](./01-design-system.md).

1. Read [problem-chat-current-implementation.md](./ai/problem-chat/problem-chat-current-implementation.md).
2. Add files under `features/problem-workspace/chatbot/` per structure above.
3. Thread `problemId` from problem page → sidebar → `Chat`.
4. TanStack in `use-problem-chat.ts` only; thin helpers in `problem-chat-api.ts`.
5. Server Actions for Nest transport — **no** `app/api/.../chat/messages` routes.
6. Update [progress-tracker.md](../progress-tracker.md) when done.
