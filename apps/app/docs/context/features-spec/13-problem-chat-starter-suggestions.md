# Feature: problem chat starter suggestions

## Goal

Show **three static starter suggestions** in the problem workspace chat when the active thread has **no messages yet**, so learners can begin tutoring with one click instead of facing a blank chat.

This is a **UI-only** slice on top of shipped streaming chat ([09-problem-chat-streaming.md](./09-problem-chat-streaming.md)) and multi-thread session header ([ai/problem-chat/12-problem-chat-session-header.md](./ai/problem-chat/12-problem-chat-session-header.md)). No Nest, BFF, or tutor prompt changes in v1.

## Reference

- [07-problem-chat-ui.md](./ai/problem-chat/07-problem-chat-ui.md) — original V1 chat UI; listed clickable starter chips as out of scope (now covered here).
- [10-problem-chat-message-ui.md](./10-problem-chat-message-ui.md) — `chat-shell`, `message-list`, `chat-input` split.
- [ai/problem-chat/problem-chat-feature.md](./ai/problem-chat/problem-chat-feature.md) — product intent for hint-style starter prompts.
- [01-design-system.md](./01-design-system.md) — feature folder layout, tokens.
- [00-index.md](./00-index.md) — feature registry.
- Existing pattern: `features/admin-chat-layout/` uses `@repo/design-system/components/ai-elements/suggestion` (`Suggestion`, `Suggestions`).

## User story

As a signed-in learner opening a new or empty tutor thread, I want quick prompt suggestions, so that I know what to ask and can start the conversation with one tap.

---

## V1 scope (deployment target)

**Ship Stage 1 only.** Static copy, client-only visibility rules, send on click.

| Stage | Status | What it delivers |
| ----- | ------ | ---------------- |
| 1 | **Shipped** | Three static suggestion chips; empty-thread visibility; click sends message |
| 2 | Post-v1 | Dynamic or problem-aware suggestions (API or per-problem config) |

---

## Requirements (Stage 1)

### Visibility

Show suggestions **only when all** of the following are true:

| Condition | Rationale |
| --------- | --------- |
| `hasProblemId` | Chat disabled when problem failed to load |
| `hasActiveThread` | Stream requires a persisted thread (session header Stage 5) |
| `!isLoadingHistory` | Avoid flashing chips while thread messages load |
| `messages.length === 0` | Hide after the first user or assistant message is present |
| `!isSending` | Prevent double-send while first message is in flight |

Hide suggestions when:

- History is loading
- Thread has any message (including after refresh)
- User clicks **+** and lands on a new empty thread → **show again** (empty messages)
- User switches to a thread with history → **hide**
- Problem id missing or no active thread

Do **not** show suggestions in the “problem could not be loaded” empty state.

### Static copy (v1)

Exactly **three** strings, defined in a small constants module (not inline in JSX):

```ts
export const problemChatStarterSuggestions = [
  "Give me a hint",
  "What pattern is this?",
  "Explain the brute force solution",
] as const;
```

Copy matches [problem-chat-feature.md](./ai/problem-chat/problem-chat-feature.md) empty-state intent. Do not add a fourth chip in v1.

### Interaction

- Clicking a chip calls the **same send path** as manual submit: `sendMessage(suggestionText)` from `use-problem-chat`.
- Do **not** only fill the textarea in v1 (admin static chat sends immediately; problem chat should match that behavior for a one-tap start).
- Respect existing guards: no send if `isSending`, missing `problemId`, or missing active thread.
- After send succeeds, suggestions disappear because `messages.length > 0`.

### UI placement

Render suggestions **between `MessageList` and `ChatInput`** inside `ChatShell` (not inside admin-style always-on input chrome).

Rationale:

- Keeps the prompt input layout stable when suggestions mount/unmount.
- Empty-state title/description stays in `MessageList` (`ConversationEmptyState`); chips are a separate actionable row below the conversation scroll area.

Layout sketch:

```txt
ChatHeader
MessageList          ← empty state copy when no messages
ChatSuggestions      ← Stage 1 (conditional)
error banner
ChatInput
```

Use design-system primitives:

- `Suggestions` — horizontal scroll row wrapper
- `Suggestion` — outline pill button (`variant="outline"`, `size="sm"`)

Spacing: match chat panel padding (`px-2` or `px-4` consistent with `ChatInput` / error banner). Optional short label above chips is **out of scope** for v1.

### Accessibility

- Each chip is a `button` (via `Suggestion` → `Button`).
- Suggestions container is a `nav` or grouped region with `aria-label="Suggested prompts"` (pick one; keep consistent with design-system patterns).

---

## Proposed file structure

```txt
apps/app/features/problem-workspace/chat-panel/
  components/
    chat-suggestions.tsx          # conditional row of Suggestion chips
  lib/
    problem-chat-starter-suggestions.ts   # static string constants
```

No new hooks required in v1. `ChatShell` wires:

- `onSuggestionClick` → `sendMessage(text)` with existing try/catch / error surfacing
- visibility props from `useProblemChat` + local `isSending`

---

## Component responsibilities

### `lib/problem-chat-starter-suggestions.ts`

- Export `problemChatStarterSuggestions` constant array (3 items).
- Export type `ProblemChatStarterSuggestion` if needed for props.

### `components/chat-suggestions.tsx`

- Props: `suggestions: readonly string[]`, `onSuggestionClick: (text: string) => void`, `disabled?: boolean`
- Renders `Suggestions` + map to `Suggestion`
- Presentational only — no TanStack or `useChat` imports

### `components/chat-shell.tsx`

- Compute `showSuggestions` from visibility rules above.
- Render `<ChatSuggestions />` when true.
- Implement `handleSuggestionClick` mirroring `handleSubmit` guards (trim not needed; strings are fixed).

### `components/message-list.tsx`

- **No change required** in Stage 1 unless empty-state description should be shortened later. Keep existing copy: “Ask for a hint, pattern nudge, or explanation.”

---

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Feature UI | `features/problem-workspace/chat-panel/` | Stage 1 only |
| Design system | `@repo/design-system/components/ai-elements/suggestion` | Reuse; do not fork |
| Nest / BFF / tutor | — | **No changes** |

---

## Out of scope (Stage 1)

- Problem-specific or difficulty-based suggestion text
- Suggestions from API or CMS
- Filling the textarea instead of sending
- Showing suggestions while history is loading
- Showing suggestions when thread has messages
- Fourth suggestion (`Can you dry-run this?`) — candidate for Stage 2
- Analytics / telemetry on chip clicks
- i18n

## Out of scope (Stage 2 — post-v1)

- Per-problem suggestion lists (e.g. from `patternTags` or admin-authored hints)
- Shuffled or ranked suggestions
- Suggestions that include current editor code in metadata
- Re-showing suggestions after “clear chat” without creating a new thread

---

## Acceptance criteria (Stage 1)

- [x] Spec registered in [00-index.md](./00-index.md).
- [x] `problemChatStarterSuggestions` exports exactly three strings.
- [x] Empty active thread shows three clickable chips; thread with messages does not.
- [x] New chat (**+**) on empty thread shows chips again.
- [x] Switching to a thread with history hides chips.
- [x] Clicking a chip sends that text through the streaming path; assistant reply appears as today.
- [x] Chips hidden while `isLoadingHistory` or `isSending`.
- [x] Missing `problemId` / no active thread: no chips, input remains disabled as today.
- [x] Uses `Suggestion` / `Suggestions` from design-system ai-elements.
- [x] `pnpm typecheck` passes for `apps/app`.

---

## Implementation prompt for agents

Implement **Stage 1 only** per this spec and [01-design-system.md](./01-design-system.md).

1. Read shipped chat panel: `chat-shell.tsx`, `message-list.tsx`, `use-problem-chat.ts`.
2. Add `lib/problem-chat-starter-suggestions.ts` and `components/chat-suggestions.tsx`.
3. Wire visibility + `handleSuggestionClick` in `ChatShell`.
4. Do not change Nest, BFF, or tutor prompts.
5. Update [progress-tracker.md](../progress-tracker.md) when Stage 1 ships.
