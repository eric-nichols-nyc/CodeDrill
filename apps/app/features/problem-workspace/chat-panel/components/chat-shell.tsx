"use client";

import type { PromptInputMessage } from "@repo/design-system/components/ai-elements/prompt-input";
import { useCallback, useState } from "react";
import { useProblemChat } from "@/features/problem-workspace/chat-panel/hooks/use-problem-chat";
import type { GetProblemChatMessagesResponse } from "@/features/problem-workspace/chat-panel/lib/problem-chat-types";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import type { MessageVote } from "./message-actions";
import { MessageList } from "./message-list";

export function ChatShell({
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
    clearVisibleChat,
    submitStatus,
    hasProblemId,
  } = useProblemChat(problemId, { initialData: initialChatData });

  const [editDraft, setEditDraft] = useState<string | undefined>();
  const [editDraftKey, setEditDraftKey] = useState(0);
  const [votes, setVotes] = useState<Record<string, MessageVote>>({});
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleNewChat = useCallback(() => {
    if (isSending) {
      return;
    }

    clearVisibleChat();
    setEditDraft(undefined);
    setEditDraftKey((key) => key + 1);
    setVotes({});
    setIsHistoryOpen(false);
  }, [clearVisibleChat, isSending]);

  const handleSelectSession = useCallback((_sessionId: string) => {
    // Stage 3 placeholder — wired when thread API lands (Stage 4/5).
    setIsHistoryOpen(false);
  }, []);

  const handleSubmit = async (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text || isSending || !hasProblemId) {
      return;
    }
    try {
      await sendMessage(text);
      setEditDraft(undefined);
    } catch {
      // Error surfaced via hook state.
    }
  };

  const handleEditMessage = useCallback((text: string) => {
    setEditDraft(text);
    setEditDraftKey((key) => key + 1);
  }, []);

  const handleVote = useCallback((messageId: string, vote: MessageVote | null) => {
    setVotes((current) => {
      const next = { ...current };
      if (vote === null) {
        delete next[messageId];
      } else {
        next[messageId] = vote;
      }
      return next;
    });
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader
        activeSessionId={null}
        historyLoading={false}
        historyOpen={isHistoryOpen}
        historySessions={[]}
        onHistoryOpenChange={setIsHistoryOpen}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
      />

      <MessageList
        hasProblemId={hasProblemId}
        isLoadingHistory={isLoadingHistory}
        messages={messages}
        onEditMessage={handleEditMessage}
        onVote={handleVote}
        submitStatus={submitStatus}
        votes={votes}
      />

      {error ? (
        <p className="mx-2 mb-1 text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}

      <ChatInput
        editDraft={editDraft}
        editDraftKey={editDraftKey}
        hasProblemId={hasProblemId}
        isSending={isSending}
        onSubmit={handleSubmit}
        submitStatus={submitStatus}
      />
    </div>
  );
}
