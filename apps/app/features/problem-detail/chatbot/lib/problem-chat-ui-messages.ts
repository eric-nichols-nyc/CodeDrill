import type { UIMessage } from "ai";
import type {
  GetProblemChatMessagesResponse,
  ProblemChatMessageDto,
} from "./problem-chat-types";

export function textFromUiMessage(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");
}

export function historyDtoToUiMessage(
  message: ProblemChatMessageDto
): UIMessage | null {
  if (message.role !== "user" && message.role !== "assistant") {
    return null;
  }

  return {
    id: message.id,
    role: message.role,
    parts: [{ type: "text", text: message.content }],
  };
}

export function historyDtoToUiMessages(
  messages: GetProblemChatMessagesResponse["messages"]
): UIMessage[] {
  return messages.flatMap((message) => {
    const uiMessage = historyDtoToUiMessage(message);
    return uiMessage ? [uiMessage] : [];
  });
}

export function problemChatStreamApiPath(problemId: string): string {
  return `/api/problems/${encodeURIComponent(problemId)}/chat/stream`;
}
