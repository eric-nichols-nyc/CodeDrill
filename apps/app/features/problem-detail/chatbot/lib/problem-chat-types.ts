/** Mirrors `apps/api/src/problem-chat/problem-chat.types.ts`. */

export type ProblemChatMessageDto = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type ProblemChatThreadDto = {
  id: string;
  userId: string;
  problemId: string;
  createdAt: string;
  updatedAt: string;
};

export type GetProblemChatMessagesResponse = {
  thread: ProblemChatThreadDto;
  messages: ProblemChatMessageDto[];
};

export type PostProblemChatMessageRequest = {
  content: string;
  metadata?: {
    code?: string;
    language?: string;
  };
};

export type PostProblemChatMessageResponse = {
  thread: ProblemChatThreadDto;
  userMessage: ProblemChatMessageDto;
  assistantMessage: ProblemChatMessageDto;
};

/** Messages shown in the chat UI (system role excluded). */
export type ProblemChatUiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

/** Server action result — avoids throwing (Next turns throws into HTTP 500). */
export type ProblemChatActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** SSE events from Nest `POST …/chat/messages/stream` (mirrors API). */
export type ProblemChatStreamEvent =
  | { type: "text-delta"; delta: string }
  | {
      type: "finish";
      userMessage: ProblemChatMessageDto;
      assistantMessage: ProblemChatMessageDto;
      thread: ProblemChatThreadDto;
    }
  | { type: "error"; message: string };
