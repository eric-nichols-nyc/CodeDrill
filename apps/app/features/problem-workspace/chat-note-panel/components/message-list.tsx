"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@repo/design-system/components/ai-elements/conversation";
import type { UIMessage } from "ai";
import type { ReactNode } from "react";
import {
  isStreamingAssistantMessage,
  shouldShowMessageThinking,
  visibleChatMessages,
  type ChatSubmitStatus,
} from "@/features/problem-workspace/chat-note-panel/lib/message-list-utils";
import type { MessageVote } from "./message-actions";
import { ChatMessage } from "./message";
import { MessageThinking } from "./message-thinking";

export type MessageListProps = {
  messages: UIMessage[];
  isLoadingHistory: boolean;
  hasProblemId: boolean;
  submitStatus: ChatSubmitStatus;
  onEditMessage?: (text: string) => void;
  votes?: Record<string, MessageVote>;
  onVote?: (messageId: string, vote: MessageVote | null) => void;
};

export function MessageList({
  messages,
  isLoadingHistory,
  hasProblemId,
  submitStatus,
  onEditMessage,
  votes = {},
  onVote,
}: MessageListProps) {
  const emptyDescription = hasProblemId
    ? "Ask for a hint, pattern nudge, or explanation."
    : "This problem could not be loaded for chat.";

  let conversationBody: ReactNode;

  if (isLoadingHistory) {
    conversationBody = (
      <ConversationEmptyState
        description="Loading your conversation…"
        title="Chat"
      />
    );
  } else if (messages.length === 0) {
    conversationBody = (
      <ConversationEmptyState
        description={emptyDescription}
        title="Start a conversation"
      />
    );
  } else {
    const visibleMessages = visibleChatMessages(messages);
    const showThinking = shouldShowMessageThinking(submitStatus, messages);

    conversationBody = (
      <>
        {visibleMessages.map((message) => (
          <ChatMessage
            isStreaming={isStreamingAssistantMessage(
              message,
              submitStatus,
              messages
            )}
            key={message.id}
            message={message}
            onEditMessage={onEditMessage}
            onVote={
              onVote
                ? (vote) => onVote(message.id, vote)
                : undefined
            }
            vote={votes[message.id] ?? null}
          />
        ))}
        {showThinking ? <MessageThinking /> : null}
      </>
    );
  }

  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent>{conversationBody}</ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
