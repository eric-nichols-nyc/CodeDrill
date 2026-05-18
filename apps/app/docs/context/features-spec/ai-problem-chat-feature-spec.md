# Feature Spec: AI Problem Chat

## Purpose

Build a production-ready, problem-aware AI chat feature for the LeetCode clone.

The assistant should help users ask questions about the active coding problem without needing to paste the problem description into the chat. The system should automatically load the correct problem context from the database and the matching markdown teaching guide before calling the AI model.

This feature includes the UI, API route, server context assembly, markdown lookup, prompt template, suggestion chips, and optional chat persistence.

---

## Important Clarification

This is one feature.

The feature is not only the chatbot UI. The API route, problem lookup, markdown context loading, prompt behavior, and response shape are all part of the feature because they are required for the chat to work correctly.

Do not leave the API/context work vague. The implementation should be production-minded and should avoid building a generic chatbot that has no awareness of the current problem.

---

## Goal

Add an `Ask AI` chat assistant to the problem workspace.

The assistant should be able to answer questions like:

- “Give me a hint.”
- “Why would I use a hashmap here?”
- “Explain the sliding window pattern for this problem.”
- “Why is my solution failing?”
- “What is the time complexity?”
- “Can you explain this without giving me the full answer?”

The user should not need to paste the problem into the chat. The server should load the problem context automatically.

---

## MVP Scope

### Must Have

- Add an `Ask AI` button to the problem workspace/header.
- Open a right-side sliding chat panel when the button is clicked.
- Allow the user to send a message.
- Include the current editor code and selected language in the request when available.
- Use a problem-specific API route: `POST /api/problems/[slug]/chat`.
- Load the problem by slug from the database on the server.
- Load a matching markdown teaching guide from `content/problems/[slug].md`.
- Build a structured AI context from DB problem data, markdown guide, user code, language, and latest user message.
- Call the LLM from the server only.
- Return an assistant message to the UI.
- Gracefully handle missing markdown files.
- Do not expose hidden test cases.
- Keep feature UI under `apps/app/features/problem-chat/`.
- Keep route/page files thin.

### Nice to Have in MVP

- Suggestion chips after assistant responses.
- Non-streaming response first, unless streaming is already easy with the existing stack.
- Local in-memory chat state in the UI.

---

## Out of Scope for MVP

Do not build these in the first pass:

- Vector database
- RAG across all problems
- Multi-agent orchestration
- Autonomous tool-calling agent
- Long-term user memory
- Voice tutor
- Interview simulation mode
- Personalized curriculum generation
- AI-generated problem creation
- AI auto-grading hidden tests
- Exposing hidden test cases to the model response
- Complex analytics dashboard
- Cross-problem semantic search
- Admin markdown editor
- Full chat history persistence if it slows down MVP delivery

These can be added later after the basic problem-aware chat works.

---

## Future Enhancements

After the MVP is working:

- Persist chat history per user and problem.
- Add streaming responses.
- Add failed-test debugging context.
- Add hint ladder mode.
- Add “explain my code” mode.
- Add “interview me” mode.
- Add related problem recommendations.
- Add pattern weakness tracking.
- Add markdown embeddings/vector search.
- Add admin UI for editing problem markdown.
- Attach run results to chat context.
- Add richer suggestion generation after each response.

---

## Existing Project Conventions

Follow the project’s feature UI convention:

```txt
apps/app/features/<feature-name>/
  components/
  hooks/
  utils/
  lib/
```

Feature UI should not be placed in global components unless it is truly shared across multiple features.

Use design-system primitives from:

```ts
@repo/design-system/components/ui/*
```

Use:

```ts
cn()
```

from:

```ts
@repo/design-system/lib/utils
```

Use semantic tokens like:

```txt
bg-background
text-muted-foreground
border-border
```

Use `lucide-react` for icons only.

Prefer named exports.

Only add `"use client"` to files that need hooks, browser APIs, or event handlers.

Routes should remain thin: fetch data, validate access, and compose feature components. Business logic should live in feature hooks, utils, lib files, or server helpers.

---

## Suggested File Structure

```txt
apps/app/features/problem-chat/
  components/
    problem-chat-panel.tsx
    problem-chat-header.tsx
    problem-chat-message-list.tsx
    problem-chat-message.tsx
    problem-chat-input.tsx
    problem-chat-suggestion-chips.tsx

  hooks/
    use-problem-chat.ts
    use-problem-chat-panel.ts

  utils/
    build-problem-chat-context.ts
    format-chat-messages.ts

  lib/
    problem-chat-schema.ts
    problem-chat-types.ts
    problem-chat-api.ts

apps/app/app/api/problems/[slug]/chat/route.ts

apps/app/lib/problems/get-problem-markdown.ts
apps/app/lib/problems/get-problem-by-slug.ts

docs/prompts/
  ai-problem-chat.md

content/problems/
  two-sum.md
  valid-anagram.md
  longest-substring-without-repeating-characters.md
```

---

## UI Requirements

### Ask AI Button

Add an `Ask AI` button to the problem workspace/header.

Behavior:

- Button opens the chat panel.
- If panel is already open, button may close/toggle it.
- Button should be visually consistent with the existing design system.

### Chat Panel

The chat panel should:

- Slide out from the right side.
- Preserve the problem/editor workspace on the left.
- Include a header with title and close button.
- Include a scrollable message list.
- Include a text input and send button.
- Support loading state while waiting for AI response.
- Support error state if the API request fails.
- Optionally show suggestion chips under assistant messages.

### Message Types

```ts
type ProblemChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  suggestions?: ProblemChatSuggestion[];
};
```

### Suggestion Chips

Suggestion chips are short follow-up prompts that the user can click.

Example:

```ts
type ProblemChatSuggestion = {
  label: string;
  value: string;
  type: "hint" | "concept" | "debug" | "complexity" | "next-step";
};
```

Clicking a suggestion should send `value` as the next user message.

---

## Frontend Request Flow

The frontend should not send the full problem context.

The frontend sends only:

```ts
type ProblemChatClientRequest = {
  message: string;
  code?: string;
  language?: string;
  conversationId?: string;
};
```

The problem slug should come from the route or current problem object.

Example:

```ts
await fetch(`/api/problems/${problem.slug}/chat`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: userMessage,
    code: editorCode,
    language: selectedLanguage,
    conversationId,
  }),
});
```

---

## API Contract

### Route

```txt
POST /api/problems/[slug]/chat
```

### Purpose

Send one user message to the AI assistant for the active problem.

The route is responsible for loading the problem context and calling the LLM.

### Request Body

```ts
type ProblemChatRequest = {
  message: string;
  code?: string;
  language?: "typescript" | "javascript" | "python" | "java" | "cpp" | string;
  conversationId?: string;
};
```

### Response Body — Non-Streaming MVP

```ts
type ProblemChatResponse = {
  conversationId?: string;
  message: {
    id: string;
    role: "assistant";
    content: string;
    createdAt: string;
  };
  suggestions?: ProblemChatSuggestion[];
};
```

### Error Responses

Invalid request:

```ts
{ error: "Invalid request" }
```

Status: `400`

Problem not found:

```ts
{ error: "Problem not found" }
```

Status: `404`

AI/provider failure:

```ts
{ error: "Unable to generate response" }
```

Status: `500`

---

## Server Flow

When a user sends a message:

1. Parse `slug` from route params.
2. Parse and validate request body.
3. Load the problem from the database by slug.
4. If problem does not exist, return `404`.
5. Load the matching markdown file from `content/problems/[slug].md`.
6. If markdown is missing, continue with DB context only.
7. Build the AI context string.
8. Load the behavior prompt from `docs/prompts/ai-problem-chat.md` or define it in a server constant.
9. Call the LLM.
10. Parse the assistant response.
11. Return assistant message and optional suggestions.

---

## Problem Lookup Helper

Create a server-side helper for loading problem data by slug.

```txt
apps/app/lib/problems/get-problem-by-slug.ts
```

Example shape:

```ts
export async function getProblemBySlug(slug: string) {
  return db.problem.findUnique({
    where: { slug },
    include: {
      examples: {
        orderBy: { sortOrder: "asc" },
      },
      tags: true,
    },
  });
}
```

Adjust the exact query to match the real schema.

Do not include hidden test cases in the AI context for MVP.

---

## Markdown Context Helper

Create:

```txt
apps/app/lib/problems/get-problem-markdown.ts
```

```ts
import fs from "fs/promises";
import path from "path";

export async function getProblemMarkdown(slug: string) {
  const filePath = path.join(
    process.cwd(),
    "content",
    "problems",
    `${slug}.md`
  );

  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}
```

This is not an AI tool.

It is a normal server-side file lookup. The server reads the markdown file and passes the text into the AI context.

---

## Markdown Guide Format

Each problem can have an optional markdown guide.

Example:

```txt
content/problems/two-sum.md
```

```md
# Two Sum

## Pattern
Hash Map

## Core Insight
Use a hashmap to remember previously seen numbers so we can check whether the complement exists.

## Common Mistakes
- Returning values instead of indices
- Inserting into the map before checking
- Not handling duplicate values like [3, 3]

## Hint Ladder
1. What number would complete the target?
2. Can you remember numbers you already saw?
3. What data structure gives fast lookup?

## Follow-up Suggestions
- Why is this O(n)?
- Explain the complement idea.
- Why does this work with duplicates?
```

The markdown guide should contain teaching context only. It should not contain hidden tests.

---

## Prompt Template

Create:

```txt
docs/prompts/ai-problem-chat.md
```

Example:

```md
# AI Problem Chat Prompt

You are an AI coding tutor inside a LeetCode-style practice app.

## Behavior Rules

- Use the current problem context when answering.
- Prefer hints before full solutions.
- Do not reveal hidden test cases.
- Explain concepts in beginner-friendly language.
- If the user asks a conceptual question, explain it using the active problem.
- If the user asks for debugging help, inspect their current code and explain the likely issue.
- If the user asks for the full solution, provide it clearly.
- Keep responses focused and practical.
- Avoid long unrelated theory unless the user asks.
- When helpful, suggest a next step.

## Response Style

- Be clear and supportive.
- Use small examples when helpful.
- Do not overwhelm the user.
- Prefer step-by-step explanation for algorithm reasoning.
```

This prompt defines behavior.

Problem-specific context comes from:

- database problem fields
- markdown guide
- user code
- selected language
- latest user message

---

## Context Builder

Create:

```txt
apps/app/features/problem-chat/utils/build-problem-chat-context.ts
```

```ts
type BuildProblemChatContextInput = {
  problem: {
    title: string;
    slug: string;
    difficulty: string;
    description: string;
    constraints?: string | null;
    examples?: {
      input: string;
      output: string;
      explanation?: string | null;
    }[];
    tags?: { name: string }[];
  };
  guide?: string | null;
  code?: string;
  language?: string;
};

export function buildProblemChatContext(input: BuildProblemChatContextInput) {
  const { problem, guide, code, language } = input;

  return `
Current problem:
${problem.title}

Slug:
${problem.slug}

Difficulty:
${problem.difficulty}

Tags:
${problem.tags?.map((tag) => tag.name).join(", ") || "None provided"}

Description:
${problem.description}

Constraints:
${problem.constraints ?? "None provided"}

Examples:
${problem.examples
  ?.map(
    (example, index) => `
Example ${index + 1}
Input: ${example.input}
Output: ${example.output}
Explanation: ${example.explanation ?? "None"}
`
  )
  .join("\n") || "No examples provided"}

Teaching guide:
${guide ?? "No markdown guide available."}

Current user code:
${code ?? "No code provided."}

Language:
${language ?? "unknown"}
`;
}
```

---

## API Route Pseudocode

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getProblemBySlug } from "@/lib/problems/get-problem-by-slug";
import { getProblemMarkdown } from "@/lib/problems/get-problem-markdown";
import { buildProblemChatContext } from "@/features/problem-chat/utils/build-problem-chat-context";

const problemChatRequestSchema = z.object({
  message: z.string().min(1),
  code: z.string().optional(),
  language: z.string().optional(),
  conversationId: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const json = await req.json();

  const parsed = problemChatRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { message, code, language, conversationId } = parsed.data;

  const problem = await getProblemBySlug(slug);

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  const guide = await getProblemMarkdown(slug);

  const context = buildProblemChatContext({
    problem,
    guide,
    code,
    language,
  });

  const result = await generateText({
    model,
    system: aiProblemChatPrompt,
    messages: [
      {
        role: "user",
        content: context,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return NextResponse.json({
    conversationId,
    message: {
      id: crypto.randomUUID(),
      role: "assistant",
      content: result.text,
      createdAt: new Date().toISOString(),
    },
  });
}
```

Use the project’s actual AI SDK/model setup.

---

## Suggestions Generation

For MVP, suggestions can be generated in the same model response or with a second helper.

Preferred structured shape:

```ts
type ProblemChatSuggestion = {
  label: string;
  value: string;
  type: "hint" | "concept" | "debug" | "complexity" | "next-step";
};
```

Example suggestions:

```ts
[
  {
    label: "Give me a hint",
    value: "Give me one small hint without the full solution.",
    type: "hint"
  },
  {
    label: "Explain the pattern",
    value: "What pattern does this problem use?",
    type: "concept"
  },
  {
    label: "Check my code",
    value: "Can you check my current code and point out the bug?",
    type: "debug"
  },
  {
    label: "Time complexity",
    value: "What is the time and space complexity?",
    type: "complexity"
  }
]
```

If structured output is too much for MVP, use a small static fallback set of suggestions based on the problem pattern.

---

## Optional Persistence

MVP can start without database persistence, but production-ready chat should eventually persist messages.

Suggested tables:

```sql
problem_chat_conversations
- id
- user_id
- problem_id
- created_at
- updated_at

problem_chat_messages
- id
- conversation_id
- role
- content
- code_snapshot
- language
- created_at
```

Rules:

- Conversations should be scoped to user and problem.
- Messages should belong to a conversation.
- Store code snapshots only when useful.
- Do not store hidden test cases in messages.

---

## Hook Responsibilities

### `use-problem-chat`

Responsible for:

- local message state
- input state
- loading state
- sending messages to API
- appending user and assistant messages
- handling API errors
- sending suggestion chip values as messages

Should not contain heavy formatting logic.

### `use-problem-chat-panel`

Responsible for:

- open/closed state
- toggle behavior
- close behavior

---

## Component Responsibilities

### `problem-chat-panel.tsx`

Composes the chat UI.

### `problem-chat-header.tsx`

Displays title and close button.

### `problem-chat-message-list.tsx`

Renders messages.

### `problem-chat-message.tsx`

Renders a single message bubble.

### `problem-chat-input.tsx`

Renders textarea/input and send button.

### `problem-chat-suggestion-chips.tsx`

Renders clickable follow-up suggestions.

---

## Security and Safety

- Do not expose API keys to the client.
- Call the AI provider only from the server.
- Validate all request bodies with Zod.
- Do not include hidden test cases in the prompt for MVP.
- Do not leak hidden tests in the assistant response.
- Treat markdown files as trusted project-authored content.
- If user code is included, pass it as context only; do not execute it inside this feature.

---

## Error Handling

The chat UI should show friendly messages for:

- invalid request
- problem not found
- AI provider failure
- network failure
- missing markdown guide

Missing markdown should not be shown as an error to the user. The assistant should still work with DB problem data.

---

## Definition of Done

- `Ask AI` button opens a right-side chat panel.
- User can send a message from a problem page.
- Frontend sends message, code, language, and optional conversation ID.
- API route is `POST /api/problems/[slug]/chat`.
- API validates request body.
- API loads problem by slug from DB.
- API loads matching markdown guide by slug if available.
- API builds AI context server-side.
- API calls the LLM server-side.
- Assistant response references the active problem correctly.
- Missing markdown does not break the feature.
- Hidden test cases are not exposed.
- Feature files live under `apps/app/features/problem-chat/`.
- Route/page files remain thin.
- UI uses design-system primitives and semantic tokens.
- MVP out-of-scope items are not implemented.

---

## Implementation Order

1. Create feature folder structure.
2. Create chat types and request schema.
3. Create `getProblemMarkdown` helper.
4. Create or reuse `getProblemBySlug` helper.
5. Create context builder utility.
6. Create API route.
7. Create chat hook.
8. Create chat panel components.
9. Add `Ask AI` button to problem workspace/header.
10. Add one markdown guide for an existing problem.
11. Test asking conceptual and code-debugging questions.
12. Add suggestion chips if MVP time allows.

---

## Agent Instructions

When implementing this feature:

- Do not overbuild RAG or agents.
- Do not add vector search.
- Do not move unrelated files.
- Follow existing project patterns.
- Keep components small.
- Extract state into hooks.
- Extract pure formatting/context logic into utils.
- Use named exports.
- Keep server-only helpers out of client components.
- Prefer simple, working MVP code over speculative architecture.
- Do not expose hidden tests.
