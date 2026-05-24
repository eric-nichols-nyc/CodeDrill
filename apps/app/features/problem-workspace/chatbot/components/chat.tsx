"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@repo/design-system/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@repo/design-system/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@repo/design-system/components/ai-elements/prompt-input";
import type { ReactNode } from "react";
import { useProblemChat } from "@/features/problem-workspace/chatbot/hooks/use-problem-chat";
import type { GetProblemChatMessagesResponse } from "@/features/problem-workspace/chatbot/lib/problem-chat-types";

export function Chat({
  problemId,
  initialChatData,
}: {
  problemId?: string;
  initialChatData?: GetProblemChatMessagesResponse;
}) {
  const {
    messages,
    isLoadingHistory,
    isSending,
    error,
    sendMessage,
    submitStatus,
    hasProblemId,
  } = useProblemChat(problemId, { initialData: initialChatData });

  const handleSubmit = async (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text || isSending || !hasProblemId) {
      return;
    }
    try {
      await sendMessage(text);
    } catch {
      // Error surfaced via hook state.
    }
  };

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
    const isStreaming = submitStatus === "streaming";
    const lastMessageId = messages.at(-1)?.id;

    conversationBody = messages.map((message) => (
      <Message from={message.role} key={message.id}>
        {message.parts
          .filter((part) => part.type === "text")
          .map((part, index) => (
            <MessageContent key={`${message.id}-${index}`}>
              {message.role === "assistant" ? (
                <MessageResponse
                  isAnimating={
                    isStreaming ? message.id === lastMessageId : false
                  }
                >
                  {part.text}
                </MessageResponse>
              ) : (
                part.text
              )}
            </MessageContent>
          ))}
      </Message>
    ));
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent>{conversationBody}</ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {error ? (
        <p className="mx-2 mb-1 text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}

      <PromptInputProvider>
        <PromptInput className="m-2 mt-0" onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              disabled={!hasProblemId || isSending}
              placeholder={
                hasProblemId ? "Type a message…" : "Chat unavailable for this problem."
              }
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit
              disabled={!hasProblemId || isSending}
              status={submitStatus}
            />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  );
}
