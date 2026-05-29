"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@repo/design-system/components/ai-elements/conversation";
import type { PromptInputMessage } from "@repo/design-system/components/ai-elements/prompt-input";
import { useCallback, useState } from "react";
import { TutorSignInPrompt } from "@/features/auth/components/tutor-sign-in-prompt";
import { useApiAuth } from "@/features/auth/hooks/use-api-auth";
import { useChatSessions } from "@/features/problem-workspace/components/chat-panel/hooks/use-chat-sessions";
import { useProblemChat } from "@/features/problem-workspace/components/chat-panel/hooks/use-problem-chat";
import type { GetProblemChatMessagesResponse } from "@/features/problem-workspace/components/chat-panel/lib/problem-chat-types";
import { problemChatStarterSuggestions } from "@/features/problem-workspace/components/chat-panel/lib/problem-chat-starter-suggestions";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatSuggestions } from "./chat-suggestions";
import type { MessageVote } from "./message-actions";
import { MessageList } from "./message-list";

function ignoreChatSubmit() {
  return;
}

function ChatAuthLoading() {
  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent>
        <ConversationEmptyState
          description="Checking your session…"
          title="Chat"
        />
      </ConversationContent>
    </Conversation>
  );
}

function SignedInChatShell({
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

  const handleSuggestionClick = useCallback(
    async (text: string) => {
      if (isSending || !hasProblemId || !hasActiveThread) {
        return;
      }
      try {
        await sendMessage(text);
        setEditDraft(undefined);
      } catch {
        // Error surfaced via hook state.
      }
    },
    [hasActiveThread, hasProblemId, isSending, sendMessage]
  );

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
  const showSuggestions =
    hasProblemId &&
    hasActiveThread &&
    !isLoadingHistory &&
    messages.length === 0 &&
    !isSending;

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

      {showSuggestions ? (
        <ChatSuggestions
          onSuggestionClick={handleSuggestionClick}
          suggestions={problemChatStarterSuggestions}
        />
      ) : null}

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

export function ChatShell({
  problemId,
  initialChatData,
}: {
  problemId?: string;
  initialChatData?: GetProblemChatMessagesResponse;
}) {
  const { isPending: isAuthPending, isSignedIn } = useApiAuth();

  if (isAuthPending) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <ChatHeader />
        <ChatAuthLoading />
        <ChatInput
          hasProblemId={false}
          isSending={false}
          onSubmit={ignoreChatSubmit}
        />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <ChatHeader />
        <TutorSignInPrompt />
        <ChatInput
          hasProblemId={false}
          isSending={false}
          onSubmit={ignoreChatSubmit}
          signedOut
        />
      </div>
    );
  }

  return (
    <SignedInChatShell initialChatData={initialChatData} problemId={problemId} />
  );
}
