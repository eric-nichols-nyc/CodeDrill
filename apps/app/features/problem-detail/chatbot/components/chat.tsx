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
import { useProblemChat } from "@/features/problem-detail/chatbot/hooks/use-problem-chat";
import type { GetProblemChatMessagesResponse } from "@/features/problem-detail/chatbot/lib/problem-chat-types";

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
    if (!text || !hasProblemId || isSending) {
      return;
    }
    try {
      await sendMessage(text);
    } catch {
      // Error surfaced via hook state.
    }
  };

  const emptyDescription = !hasProblemId
    ? "This problem could not be loaded for chat."
    : "Ask for a hint, pattern nudge, or explanation.";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent>
          {isLoadingHistory ? (
            <ConversationEmptyState
              description="Loading your conversation…"
              title="Chat"
            />
          ) : messages.length === 0 ? (
            <ConversationEmptyState
              description={emptyDescription}
              title="Start a conversation"
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.role === "assistant" ? (
                    <MessageResponse>{message.content}</MessageResponse>
                  ) : (
                    message.content
                  )}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
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

      {isSending ? (
        <p className="mx-2 mb-2 text-muted-foreground text-xs">Thinking…</p>
      ) : null}
    </div>
  );
}
