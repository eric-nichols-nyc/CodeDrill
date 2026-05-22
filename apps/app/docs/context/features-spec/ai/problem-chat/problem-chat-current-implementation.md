# Current Problem Chat Implementation

## DB Tables Already Exist

The existing database shape is already close to what v1 needs.

### `problem_chat_thread`

- One thread per `(user, problem)`
- Stores:
  - `id`
  - `userId`
  - `problemId`
  - `createdAt`
  - `updatedAt`

### `problem_chat_message`

- Messages belong to a thread
- Stores:
  - `id`
  - `threadId`
  - `role`
  - `content`
  - `metadata`
  - `createdAt`

### Current DB Assessment

- Keep the existing chat tables
- Do not rewrite the chat persistence model
- Reuse `metadata` for lightweight extra context like current code or selected language if needed

---

## Current API Routes

### `GET /problems/:problemId/chat/messages`

Returns the current user’s thread and message history for a problem.

#### Current behavior

- Requires authenticated user session
- Creates the thread if it does not already exist
- Loads messages ordered by `createdAt ASC`
- Returns thread info and messages
- Does not call the model
- Does not build tutor context

#### Current response shape

```ts
{
  thread: {
    id: string;
    userId: string;
    problemId: string;
    createdAt: string;
    updatedAt: string;
  };
  messages: {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    metadata: Record<string, unknown> | null;
    createdAt: string;
  }[];
}
```

### `POST /problems/:problemId/chat/messages`

Runs the tutor pipeline (non-streaming). Requires session and `OPENAI_API_KEY`.

**Request:** `{ content: string, metadata?: { code?: string, language?: string } }`

**Response** (`PostProblemChatMessageResponse` in `apps/api/src/problem-chat/problem-chat.types.ts`):

```ts
{
  thread: {
    id: string;
    userId: string;
    problemId: string;
    createdAt: string;
    updatedAt: string;
  };
  userMessage: {
    id: string;
    role: string;
    content: string;
    metadata: Record<string, unknown> | null;
    createdAt: string;
  };
  assistantMessage: {
    id: string;
    role: string;
    content: string;
    metadata: Record<string, unknown> | null;
    createdAt: string;
  };
}
```

Message objects use the same shape as items in `GET …/chat/messages` `messages[]`. Frontend can append `userMessage` and `assistantMessage` to local state and update `thread` from the POST body.