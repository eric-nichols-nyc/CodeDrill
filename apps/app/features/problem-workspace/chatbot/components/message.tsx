"use client";

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@repo/design-system/components/ai-elements/message";
import type { UIMessage } from "ai";
import { textFromUiMessage } from "@/features/problem-workspace/chatbot/lib/problem-chat-ui-messages";
import {
  MessageActionsBar,
  type MessageVote,
} from "./message-actions";

export type ChatMessageProps = {
  message: UIMessage;
  isStreaming: boolean;
  onEditMessage?: (text: string) => void;
  vote?: MessageVote | null;
  onVote?: (vote: MessageVote | null) => void;
};

export function ChatMessage({
  message,
  isStreaming,
  onEditMessage,
  vote,
  onVote,
}: ChatMessageProps) {
  if (message.role !== "user" && message.role !== "assistant") {
    return null;
  }

  const text = textFromUiMessage(message);
  const textParts = message.parts.filter((part) => part.type === "text");

  return (
    <div className="group/message w-full">
      <Message from={message.role}>
        {textParts.map((part, index) => (
          <MessageContent key={`${message.id}-${index}`}>
            {message.role === "assistant" ? (
              <MessageResponse isAnimating={isStreaming}>{part.text}</MessageResponse>
            ) : (
              part.text
            )}
          </MessageContent>
        ))}
        <MessageActionsBar
          onEditMessage={onEditMessage}
          onVote={onVote}
          role={message.role}
          text={text}
          vote={vote}
        />
      </Message>
    </div>
  );
}
