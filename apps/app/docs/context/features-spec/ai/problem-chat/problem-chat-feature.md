
**`problem-chat-feature.md`**
```md
# Problem Chat Feature

## Goal

Add an AI chat assistant to each problem page that helps users understand the current coding problem.

The assistant should behave like a tutor, using the rules from:

- `tutor-behavior.md`
- `problem-context.md`

## Core Requirements

- User can open a chat panel from the problem page
- Chat is connected to the current problem
- Messages are saved to the database
- Chat history loads when the user returns
- AI receives structured problem context
- AI should support hint-style tutoring
- Assistant messages should support markdown and code blocks
- The implementation should reuse the existing chat DB and API structure where possible

## API Flow

1. User sends message
2. API receives `problemId` and `message`
3. API saves the user message
4. API fetches structured problem context from existing problem data
5. API fetches recent chat history
6. API builds tutor prompt
7. API calls OpenAI
8. API saves assistant response
9. API returns assistant message to the UI

## UI Requirements

- Chat panel can open and close
- Message list supports user and assistant messages
- Assistant messages support markdown
- Code blocks are readable
- Empty state can suggest starter prompts:
  - `Give me a hint`
  - `What pattern is this?`
  - `Explain the brute force solution`
  - `Can you dry-run this?`

## Feature Folder

```txt
apps/app/features/problem-chat/
  components/
  hooks/
  utils/
  lib/

  ## V1 Decision

Start with DB-backed problem context only.

Use the existing problem chat tables and current Nest problem details data.
Do not add markdown tutor files in v1.
Do not rewrite chat persistence.
Do not add new tables unless a real gap appears.

### V1 Scope
- Reuse `problem_chat_thread`
- Reuse `problem_chat_message`
- Load full problem details from the existing problems service
- Build structured `ProblemContext` from DB fields
- Apply tutor behavior prompt
- Save both user and assistant messages
- Return assistant response to the UI

### Deferred
- Markdown tutor files
- Streaming responses
- Rich suggestion chips
- Additional tutor-only metadata tables

  ## V1 API Contract

### Route

`POST /problems/:problemId/chat/messages`

### V1 Behavior

- v1 is non-streaming
- request requires authenticated user session
- API saves the user message first
- API loads structured problem context from existing DB-backed problem data
- API loads recent thread history
- API calls the tutor model
- API saves the assistant message
- API returns both saved messages

### Request Body

```ts
type PostProblemChatMessageRequest = {
  content: string;
  metadata?: {
    code?: string;
    language?: string;
  };
};

## V1 Backend Implementation Shape

The goal is to extend the existing Nest problem chat flow with the fewest possible new pieces.

### Existing Files To Reuse

- `apps/api/src/problem-chat/problem-chat.controller.ts`
- `apps/api/src/problem-chat/problem-chat.service.ts`
- `apps/api/src/problem-chat/dto/post-problem-chat-message.dto.ts`
- `apps/api/src/problems/problems.service.ts`

### Smallest New Backend Pieces

#### 1. Add a problem context builder

Create a small helper that maps the existing problem details result into a structured `ProblemContext`.

Suggested file:

`apps/api/src/problem-chat/problem-context.builder.ts`

Suggested responsibility:

- accept full problem details data
- map DB rows into `ProblemContext`
- keep logic out of the controller
- keep logic small and deterministic

Example shape:

```ts
type ProblemContext = {
  id: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  constraints?: string | null;
  examples: {
    input: string;
    output: string;
    explanation?: string | null;
  }[];
  starterCode?: {
    language: string;
    code: string;
    functionName?: string | null;
  }[];
  solutionCode?: {
    language: string;
    code: string;
    explanation?: string | null;
    timeComplexity?: string | null;
    spaceComplexity?: string | null;
  }[];
  patternTags?: string[];
  relatedConcepts?: string[];
  commonMistakes?: string[];
  hiddenInsights?: string[];
  tutorLevel?: string | null;
};

## V1 Model Call Shape

The first implementation should keep the model call simple and contained.

### Goal

Take:
- tutor system prompt
- structured `ProblemContext`
- recent chat history
- latest user message

Return:
- one assistant reply string

### Suggested Responsibility Split

#### `tutor-prompt.builder.ts`

Builds the system prompt text.

#### `problem-context.builder.ts`

Builds the structured problem context object.

#### `ProblemChatService`

Orchestrates:
- loading data
- building prompt inputs
- calling the model
- saving assistant reply

---

## Suggested Model Call Input

```ts
type GenerateTutorReplyInput = {
  systemPrompt: string;
  problemContext: ProblemContext;
  history: {
    role: "user" | "assistant" | "system";
    content: string;
  }[];
  userMessage: string;
  code?: string;
  language?: string;
};