# Feature: problem-chat streaming (V2)

## Goal

Add **streaming tutor replies** to the existing problem-page chatbot by extending the Nest `problem-chat` module and refactoring the current client send path — **not** building a parallel chatbot.

V1 ([07-problem-chat-ui.md](./07-problem-chat-ui.md)) ships blocking POST + Server Actions + TanStack Query. V2 keeps history load and persistence in Nest; only the **send/stream path** changes. Round 1 prioritizes the smallest shippable slice: stream tokens to the UI with no UI restructure, no Framer Motion, and no new product behavior.

## Reference

- [07-problem-chat-ui.md](./07-problem-chat-ui.md) — V1 chatbot (refactor target, not replace).
- [01-design-system.md](./01-design-system.md) — feature UI layout.
- [03-problem-progress.md](./03-problem-progress.md) — BFF route auth pattern (`apiAuthHeaders`).
- [08-api-auth-consolidation.md](./08-api-auth-consolidation.md) — Bearer transport to Nest.
- Backend (read-only until Stage 1 ships):
  - [ai/problem-chat/problem-chat-current-implementation.md](./ai/problem-chat/problem-chat-current-implementation.md)
  - [ai/problem-chat/tutor-behavior.md](./ai/problem-chat/tutor-behavior.md)
  - [ai/problem-chat/problem-context.md](./ai/problem-chat/problem-context.md)
- In-repo references (patterns only — do not import from `docs/`):
  - `docs/app/api/chat/route.ts` — `createUIMessageStream` / `createUIMessageStreamResponse`
  - `docs/components/geistdocs/chat.tsx` — `useChat` + `DefaultChatTransport` + `message.parts`
  - `apps/app/features/admin-chat-layout/` — future component split pattern (Stage 4)

## User story

As a signed-in learner on a problem page, I want tutor replies to appear token-by-token as they are generated, so that the chat feels responsive while still persisting when I refresh.

---

## Approach

**Refactor in place** under `features/problem-workspace/chatbot/`. Do not add `chatbot-v2/` or a second sidebar integration.

| Concern | V1 (keep) | V2 (add / change) |
| ------- | --------- | ----------------- |
| History load | Server Action → Nest `GET` + TanStack `useQuery` | Unchanged |
| Send message | Server Action → Nest blocking `POST` | `useChat` → Next BFF → Nest stream `POST` |
| Persistence | Nest saves user + assistant on blocking POST | Nest saves user upfront, assistant on stream finish |
| UI shell | Single `chat.tsx` | Same file in round 1; split components later |
| Fallback | — | Keep blocking `POST` until stream is stable |

**Why API first:** tutor prompt, problem context, and DB writes live in `apps/api/src/problem-chat/`. Streaming from Next alone would duplicate that logic.

**Why a BFF route:** Server Actions cannot stream. V1 explicitly avoided `app/api/.../chat/`; streaming is the reason to add one route.

---

## Staged delivery

Implement in order. Each stage is independently testable.

### Stage 1 — Nest stream endpoint (API only)

**Scope:** New route only. Do not remove or change blocking `POST` behavior.

| Method | Path | Auth | Body | Response |
| ------ | ---- | ---- | ---- | -------- |
| `POST` | `/problems/:problemId/chat/messages/stream` | Session (same guard as V1) | `{ content: string, metadata?: { code?: string, language?: string } }` | `text/event-stream` — plain text deltas |

**Server flow (same persistence model as V1):**

1. Auth + `getOrCreateThread`
2. Persist **user** message
3. Build tutor system prompt + problem context (reuse existing builders)
4. Call OpenAI with `stream: true`
5. Pipe token deltas to client as SSE
6. On `finish`: persist **assistant** message with full content + `touchThread`
7. On error mid-stream: persist tutor-error stub (match existing `tutorError` metadata pattern) or partial content — document choice in implementation

**SSE format (round 1 — simplest):**

- Each event: `data: <json>\n\n` where JSON is `{ "type": "text-delta", "delta": "..." }`
- Final event: `{ "type": "finish", "assistantMessageId": "...", "thread": { ... } }` (or separate metadata event)
- Error event: `{ "type": "error", "message": "..." }`

Do **not** require AI SDK stream format from Nest in round 1. Next can wrap plain deltas in Stage 2.

**Verify:** curl / Postman with Bearer token; confirm user + assistant rows in DB after stream completes.

**Files (expected):**

```txt
apps/api/src/problem-chat/
  problem-chat.controller.ts    # add stream handler
  problem-chat.service.ts       # add postTutorMessageStream (or extract shared prep)
  problem-chat.types.ts         # stream event types (optional)
```

### Stage 2 — Next BFF proxy

**Scope:** One route handler. Auth mirrors progress BFF.

| Method | Path | Auth | Body | Response |
| ------ | ---- | ---- | ---- | -------- |
| `POST` | `/api/problems/[problemId]/chat/stream` | `apiAuthHeaders()` | Forward client body to Nest | UI message stream (preferred) or passthrough SSE |

**Implementation options (pick one in Stage 2):**

1. **Passthrough** — proxy Nest SSE as-is; client uses custom transport (more client work).
2. **Wrap (recommended)** — read Nest SSE, emit `createUIMessageStream` + `createUIMessageStreamResponse` so `useChat` works with `DefaultChatTransport`.

Follow `app/api/problems/[problemId]/progress/route.ts` for auth and upstream fetch. Set `cache: "no-store"`.

**Files (expected):**

```txt
apps/app/app/api/problems/[problemId]/chat/stream/route.ts
```

### Stage 3 — Client refactor (minimal)

**Scope:** Swap send path only. Keep single `chat.tsx`.

**Hook (`use-problem-chat.ts`):**

- **Keep:** TanStack `useQuery` for history (`getProblemChatMessages` via Server Action).
- **Add:** `useChat` from `@ai-sdk/react` with `DefaultChatTransport({ api: "/api/problems/{problemId}/chat/stream" })`.
- **Hydrate:** On history load, map persisted DTOs → `UIMessage` and call `setMessages` once.
- **Send:** `sendMessage({ text })` from `useChat` instead of `useMutation` + blocking POST.
- **Status:** Map `useChat` `status` → `PromptInputSubmit` (`submitted` / `streaming` / `error`).
- **On finish:** Invalidate or patch TanStack cache so refresh matches DB.

**UI (`chat.tsx`):**

- Render assistant text via `message.parts` (filter `type === "text"`), same as geistdocs reference.
- Keep `MessageResponse` for markdown.
- Remove separate “Thinking…” line — submit button status is enough.
- Do not add Framer Motion or component splits in round 1.

**Dependencies (already in `apps/app/package.json`):** `ai`, `@ai-sdk/react`.

**Files touched (expected):**

```txt
apps/app/features/problem-workspace/chatbot/
  hooks/use-problem-chat.ts
  components/chat.tsx
  lib/problem-chat-types.ts          # UIMessage mapping helpers if needed
```

**Unchanged in round 1:**

- `actions/problem-chat.actions.ts` — still used for GET history
- `lib/problem-chat-server.ts` — still used for GET
- Sidebar wiring (`problem-side-tabs.tsx`, etc.)

### Stage 4 — Polish (later, out of round 1)

- Split `chat.tsx` → `chat-message-list.tsx` + `chat-input.tsx` (admin-chat-layout pattern)
- Framer Motion message enter animations
- Starter suggestion chips (`Suggestions` from ai-elements)
- Stop generation (`useChat` stop + `PromptInputSubmit` streaming state)
- POST `metadata.code` / `metadata.language` from workspace
- Remove blocking POST + Server Action send path once stream is stable

---

## State ownership (V2)

| State | Owner |
| ----- | ----- |
| Persisted history | TanStack Query (GET) + DB |
| In-flight stream | `useChat` messages + `status` |
| Draft input | `PromptInputProvider` (local) |
| Thread metadata after send | Nest finish event → TanStack cache patch |

---

## System boundaries

| Layer | Path | Notes |
| ----- | ---- | ----- |
| Nest API | `apps/api/src/problem-chat/` | New stream endpoint; existing GET + blocking POST unchanged in round 1 |
| BFF | `apps/app/app/api/problems/[problemId]/chat/stream/` | **New** — required for streaming |
| Server Actions | `features/problem-workspace/chatbot/actions/` | GET only in round 1 |
| Feature UI | `features/problem-workspace/chatbot/` | Refactor hook + `chat.tsx` |
| Design system | `@repo/design-system/components/ai-elements/*` | No fork; reuse Conversation, Message, PromptInput |

---

## Types (sketch)

```ts
/** Nest SSE events (round 1) */
type ProblemChatStreamEvent =
  | { type: "text-delta"; delta: string }
  | {
      type: "finish";
      assistantMessage: ProblemChatMessageDto;
      userMessage: ProblemChatMessageDto;
      thread: ProblemChatThreadDto;
    }
  | { type: "error"; message: string };

/** Client POST body — same as V1 */
type PostProblemChatMessageRequest = {
  content: string;
  metadata?: { code?: string; language?: string };
};
```

Reuse `ProblemChatMessageDto` / `ProblemChatThreadDto` from `problem-chat.types.ts` (app + API).

---

## Out of scope (round 1)

- New chatbot folder or duplicate sidebar integration
- UI restructure / Framer Motion
- Starter prompts, model selector, attachments, tools
- Streaming through Server Actions
- Removing blocking `POST` (defer to Stage 4)
- Nest / DB schema changes
- Changes to tutor prompt behavior (reuse existing builders)
- Admin chat streaming

---

## Acceptance criteria

### Stage 1 (API)

- [x] `POST /problems/:problemId/chat/messages/stream` exists and requires auth
- [x] User message persisted before first token
- [x] Assistant message persisted after stream completes
- [x] Blocking `POST` still works unchanged
- [x] curl/manual test documented in spec or progress tracker

### Stage 2 (BFF)

- [x] Route at `app/api/problems/[problemId]/chat/stream/route.ts`
- [x] Unsigned user gets 401 with friendly message
- [x] Stream reaches client through Next with auth

### Stage 3 (client)

- [x] Signed-in user sees tokens appear incrementally
- [x] Refresh shows full persisted assistant message
- [x] History load on mount unchanged (TanStack + Server Action)
- [x] `PromptInputSubmit` reflects streaming status
- [x] `system` messages never rendered
- [ ] `pnpm typecheck` passes for `apps/app` and `apps/api`

### Doc hygiene

- [ ] Spec registered in [00-index.md](./00-index.md)
- [ ] [progress-tracker.md](../progress-tracker.md) updated when a stage ships
- [ ] Update [ai/problem-chat/problem-chat-current-implementation.md](./ai/problem-chat/problem-chat-current-implementation.md) after Stage 1

---

## Implementation prompt for agents

Implement **problem-chat streaming V2** per this spec. **Refactor** `features/problem-workspace/chatbot/` — do not create a parallel chatbot.

1. Read [07-problem-chat-ui.md](./07-problem-chat-ui.md) and [ai/problem-chat/problem-chat-current-implementation.md](./ai/problem-chat/problem-chat-current-implementation.md).
2. **Stage 1 only** unless the user asks for more: add Nest stream endpoint; keep blocking POST; verify with curl.
3. **Stage 2:** add BFF route using `apiAuthHeaders()` (see progress route); wrap Nest SSE for `useChat` if practical.
4. **Stage 3:** add `useChat` send path in `use-problem-chat.ts`; minimal `chat.tsx` changes for `message.parts`.
5. Do not add Framer Motion, component splits, or suggestions in round 1.
6. Update [progress-tracker.md](../progress-tracker.md) when each stage completes.
