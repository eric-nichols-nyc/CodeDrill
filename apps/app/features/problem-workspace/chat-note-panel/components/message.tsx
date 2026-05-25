"use client";

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@repo/design-system/components/ai-elements/message";
import type { UIMessage } from "ai";
import { SparklesIcon } from "@/components/icons";
import { textFromUiMessage } from "@/features/problem-workspace/chat-note-panel/lib/problem-chat-ui-messages";
import { MessageActionsBar, type MessageVote } from "./message-actions";

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
        {message.role === "assistant" ? (
          <div className="flex h-[calc(13px*1.65)] shrink-0 items-center">
            <div className="flex size-7 items-center justify-center rounded-lg bg-white/25 text-muted-foreground ring-1 ring-border/40">
              <SparklesIcon size={13} />
            </div>
          </div>
        ) : null}
        {textParts.map((part, index) => (
          <MessageContent key={`${message.id}-${index}`}>
            {message.role === "assistant" ? (
              <MessageResponse isAnimating={isStreaming}>
                {part.text}
              </MessageResponse>
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
