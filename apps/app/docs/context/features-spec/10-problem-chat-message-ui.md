# Feature: problem-chat message UI (round 2)

## Goal

Refactor the problem-workspace chatbot UI into smaller, named components; show a **Thinking…** assistant loading row while the model is working; and add per-message actions (copy/edit for user, copy/upvote/downvote for assistant). This is **UI-only polish** on top of shipped streaming ([09-problem-chat-streaming.md](./09-problem-chat-streaming.md)) — no change to Nest stream protocol, BFF route, or tutor prompt unless vote persistence is explicitly added in a follow-up slice.

## Reference

- [07-problem-chat-ui.md](./07-problem-chat-ui.md) — V1 history, types, hook boundaries.
- [09-problem-chat-streaming.md](./09-problem-chat-streaming.md) — streaming send path; Stage 4 polish deferred here.
- [01-design-system.md](./01-design-system.md) — feature folder layout, tokens, SOLID.
- [00-index.md](./00-index.md) — feature registry.
- Component split pattern: `apps/app/features/admin-chat-layout/` (list + input).
- Design-system primitives:
  - `@repo/design-system/components/ai-elements/message` — `Message`, `MessageContent`, `MessageResponse`, `MessageActions`, `MessageAction`
  - `@repo/design-system/components/ai-elements/shimmer` — `Shimmer`
  - `@repo/design-system/components/ai-elements/conversation` — `Conversation`, `ConversationContent`, etc.
  - `@repo/design-system/components/ai-elements/prompt-input` — input shell (unchanged behavior)

## User story

As a signed-in learner on a problem page, I want the tutor chat to feel responsive and easy to reuse (copy, edit my question, rate replies), so that I can iterate on hints without friction.

---

## Requirements

### Component rename and layout

- Rename `chatbot/components/chat.tsx` → **`chat-shell.tsx`**.
- Export **`ChatShell`** (update imports in `chat-notes-tabs.tsx` and any other consumers).
- `ChatShell` owns: hook wiring, error banner, composes `MessageList` + `ChatInput`.
- Do **not** add `chatbot-v2/` or duplicate sidebar integration.

### File structure and naming

All new/refactored files live under `apps/app/features/problem-workspace/chatbot/components/` with a consistent **`{area}-{part}.tsx`** kebab-case pattern:

```txt
chatbot/components/
  chat-shell.tsx           # shell: hook, error, MessageList + ChatInput
  message-list.tsx         # Conversation wrapper, empty/loading states, maps messages
  message.tsx              # single message (user OR assistant)
  message-thinking.tsx     # assistant loading row (Thinking…)
  message-actions.tsx      # action toolbar (role-specific actions)
  chat-input.tsx           # PromptInputProvider + submit (extracted from shell)
```

Existing paths unchanged: `hooks/use-problem-chat.ts`, `lib/*`, `actions/*`.

### `message-list.tsx`

- Renders `Conversation` / `ConversationContent` / `ConversationScrollButton`.
- Loading history: `ConversationEmptyState` (“Loading your conversation…”).
- Empty thread: `ConversationEmptyState` (existing copy from shell).
- Maps `messages` to `<Message />` for each `UIMessage`.
- Appends `<MessageThinking />` when assistant is waiting for first token (see below).
- Props include: `messages`, `isLoadingHistory`, `hasProblemId`, `submitStatus`, `onEditMessage?`.

### `message.tsx`

- **One component** for both `user` and `assistant` roles (`from` prop or `message.role`).
- Renders text parts via `textFromUiMessage` / filtered `message.parts` (`type === "text"` only).
- **Assistant:** `MessageResponse` with `isAnimating` when `submitStatus === "streaming"` and this message is the last assistant message with content.
- **User:** plain text in `MessageContent` (existing behavior).
- Wraps content in design-system `Message` + `MessageContent`.
- Renders `<MessageActions />` below content (hover/focus visible via `group/message` or `Message` group styles).
- Does not render `system` roles (unchanged).

### `message-thinking.tsx`

- Shown when `submitStatus === "submitted"` (request in flight, no stream tokens yet).
- Hidden when `submitStatus === "streaming"` **or** when the last message is a non-empty assistant message.
- Markup **must** match:

```tsx
<div
  className="group/message w-full"
  data-role="assistant"
  data-testid="message-assistant-loading"
>
  <div className="flex h-[calc(13px*1.65)] items-center text-[13px] leading-[1.65]">
    <Shimmer className="font-medium" duration={1}>
      Thinking...
    </Shimmer>
  </div>
</div>
```

- Import `Shimmer` from `@repo/design-system/components/ai-elements/shimmer`.

### `message-actions.tsx`

- Shared action row using `MessageActions` + `MessageAction` from ai-elements.
- Icons: `lucide-react` only.

| Role | Actions | Behavior |
| ---- | ------- | -------- |
| `user` | Copy, Edit | **Copy:** clipboard + brief “Copied” feedback. **Edit:** call `onEditMessage(text)` to populate draft input (new send — no server edit). |
| `assistant` | Copy, Upvote, Downvote | **Copy:** same as user. **Vote:** toggle up/down (mutually exclusive); see persistence below. |

- Actions visible on hover/focus of the message row; accessible labels via `MessageAction` `tooltip` / `label`.

### `chat-input.tsx`

- Extract `PromptInputProvider` + `PromptInput` + textarea + submit from shell.
- Props: `hasProblemId`, `isSending`, `submitStatus`, `onSubmit`, optional `initialDraft` / `draftKey` for edit refill.
- Placeholder and disabled rules unchanged from current shell.

### Thinking state logic

| `submitStatus` | UI |
| -------------- | -- |
| `submitted` | Show `MessageThinking` |
| `streaming` | Hide thinking; animate last assistant `MessageResponse` |
| `ready` / `error` | No thinking row |

---

## Vote persistence (decision required before ship)

**Default for round 2 (this spec): client-only vote state** keyed by `message.id` (lost on refresh). Document in code with a `// TODO: persist via API` if no endpoint exists.

**Optional follow-up slice (out of scope for round 2 unless explicitly scheduled):**

- `PATCH /problems/:problemId/chat/messages/:messageId/feedback`
- Store `{ vote: "up" | "down" | null }` in `problem_chat_message.metadata` (jsonb already exists).

Do not block component refactor on API work.

---

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `apps/app/features/problem-workspace/chatbot/components/` | This spec only |
| Hook | `chatbot/hooks/use-problem-chat.ts` | Minimal changes (expose status if needed; no transport change) |
| BFF | `app/api/problems/[problemId]/chat/stream/route.ts` | Unchanged |
| API | `apps/api/src/problem-chat/` | Unchanged in round 2 |
| Sidebar | `chat-notes-tabs.tsx` | Import `ChatShell` from `chat-shell.tsx` |

---

## State ownership

| State | Owner |
| ----- | ----- |
| Persisted messages | TanStack Query + `useChat` hydration (unchanged) |
| Stream / submit status | `useProblemChat` → `submitStatus`, `isSending` |
| Draft input | `PromptInputProvider` in `chat-input.tsx` |
| Edit refill | `ChatShell` local state or `PromptInputProvider` API — pass `onEditMessage` to list/message |
| Message votes (round 2) | Local React state in shell or `message-actions` hook |

---

## Out of scope (this pass)

- Framer Motion message enter animations
- Starter suggestion chips
- Stop generation button
- POST `metadata.code` / `metadata.language` from workspace
- Removing blocking `POST` Server Action path
- Nest / DB schema changes (unless vote API slice is scheduled separately)
- Tutor prompt or context changes

---

## Acceptance criteria

### Structure

- [ ] `chat.tsx` removed; `chat-shell.tsx` exports `ChatShell`.
- [ ] `message-list.tsx`, `message.tsx`, `message-thinking.tsx`, `message-actions.tsx`, `chat-input.tsx` exist with responsibilities above.
- [ ] `chat-notes-tabs.tsx` imports `ChatShell` from `chat-shell.tsx`.
- [ ] No duplicate chatbot folder or route.

### Thinking row

- [ ] While `submitStatus === "submitted"`, `data-testid="message-assistant-loading"` row shows Shimmer “Thinking...” per markup above.
- [ ] Row hides when streaming content appears.

### Actions

- [ ] User messages: copy and edit (edit refills input).
- [ ] Assistant messages: copy, upvote, downvote (client-only toggle acceptable for round 2).
- [ ] `system` messages never rendered.

### Quality

- [ ] Semantic tokens only; primitives from `@repo/design-system`.
- [ ] `pnpm typecheck` passes for `apps/app`.
- [ ] Spec registered in [00-index.md](./00-index.md).

---

## Implementation prompt for agents

Implement **problem-chat message UI round 2** per this spec.

1. Read [07-problem-chat-ui.md](./07-problem-chat-ui.md), [09-problem-chat-streaming.md](./09-problem-chat-streaming.md), and `features/problem-workspace/chatbot/`.
2. Refactor in place under `chatbot/components/` — use the exact file names in this spec.
3. Rename `chat.tsx` → `chat-shell.tsx`; export `ChatShell`; update sidebar import.
4. Implement `MessageThinking` with the exact `data-testid` and Shimmer markup.
5. Split list, message, actions, and input; keep `use-problem-chat.ts` transport unchanged.
6. Wire copy/edit/vote UI; votes client-only unless user requests API slice.
7. Update [progress-tracker.md](../progress-tracker.md) when implementation ships.
8. Do not modify `packages/design-system/components/ui/**` or Nest unless adding vote persistence.
