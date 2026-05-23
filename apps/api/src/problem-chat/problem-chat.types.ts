/** Serialized chat message — shared by GET history and POST tutor reply. */
export type ProblemChatMessageDto = {
  id: string;
  role: string;
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

/** POST /problems/:problemId/chat/messages — both persisted messages + updated thread. */
export type PostProblemChatMessageResponse = {
  thread: ProblemChatThreadDto;
  userMessage: ProblemChatMessageDto;
  assistantMessage: ProblemChatMessageDto;
};

/** SSE events from POST /problems/:problemId/chat/messages/stream */
export type ProblemChatStreamEvent =
  | { type: "text-delta"; delta: string }
  | {
      type: "finish";
      userMessage: ProblemChatMessageDto;
      assistantMessage: ProblemChatMessageDto;
      thread: ProblemChatThreadDto;
    }
  | { type: "error"; message: string };
