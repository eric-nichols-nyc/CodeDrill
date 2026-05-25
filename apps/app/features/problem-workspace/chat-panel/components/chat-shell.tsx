"use client";

import type { PromptInputMessage } from "@repo/design-system/components/ai-elements/prompt-input";
import { useCallback, useState } from "react";
import { useChatSessions } from "@/features/problem-workspace/chat-panel/hooks/use-chat-sessions";
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
  const [editDraft, setEditDraft] = useState<string | undefined>();
  const [editDraftKey, setEditDraftKey] = useState(0);
  const [votes, setVotes] = useState<Record<string, MessageVote>>({});
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const {
    activeThreadId,
    setActiveThreadId,
    threads,
    isLoadingThreads,
    createNewThread,
    selectThread,
  } = useChatSessions(problemId, { historyEnabled: isHistoryOpen });

  const {
    messages,
    isLoadingHistory,
    isSending,
    error,
    sendMessage,
    submitStatus,
    hasProblemId,
    hasActiveThread,
  } = useProblemChat(problemId, {
    initialData: initialChatData,
    activeThreadId,
    onActiveThreadResolved: setActiveThreadId,
  });

  const resetLocalUiState = useCallback(() => {
    setEditDraft(undefined);
    setEditDraftKey((key) => key + 1);
    setVotes({});
  }, []);

  const handleNewChat = useCallback(async () => {
    if (isSending) {
      return;
    }

    try {
      await createNewThread();
      resetLocalUiState();
      setIsHistoryOpen(false);
    } catch {
      // Error surfaced via hook state when applicable.
    }
  }, [createNewThread, isSending, resetLocalUiState]);

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      if (sessionId === activeThreadId) {
        setIsHistoryOpen(false);
        return;
      }

      selectThread(sessionId);
      resetLocalUiState();
      setIsHistoryOpen(false);
    },
    [activeThreadId, resetLocalUiState, selectThread]
  );

  const handleSubmit = async (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text || isSending || !hasProblemId || !hasActiveThread) {
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

  const chatInputEnabled = Boolean(hasProblemId) && Boolean(hasActiveThread);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader
        activeSessionId={activeThreadId}
        historyLoading={isLoadingThreads}
        historyOpen={isHistoryOpen}
        historySessions={threads}
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
        hasProblemId={chatInputEnabled}
        isSending={isSending}
        onSubmit={handleSubmit}
        submitStatus={submitStatus}
      />
    </div>
  );
}
