import type { UIMessage } from "ai";
import { textFromUiMessage } from "./problem-chat-ui-messages";

export type ChatSubmitStatus = "submitted" | "streaming" | "error" | undefined;

export function shouldShowMessageThinking(
  submitStatus: ChatSubmitStatus,
  messages: UIMessage[]
): boolean {
  if (submitStatus !== "submitted") {
    return false;
  }

  const last = messages.at(-1);
  if (
    last?.role === "assistant" &&
    textFromUiMessage(last).trim().length > 0
  ) {
    return false;
  }

  return true;
}

export function isStreamingAssistantMessage(
  message: UIMessage,
  submitStatus: ChatSubmitStatus,
  messages: UIMessage[]
): boolean {
  if (submitStatus !== "streaming" || message.role !== "assistant") {
    return false;
  }

  return messages.at(-1)?.id === message.id;
}

export function visibleChatMessages(messages: UIMessage[]): UIMessage[] {
  return messages.filter(
    (message) => message.role === "user" || message.role === "assistant"
  );
}
