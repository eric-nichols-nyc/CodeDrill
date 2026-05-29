"use client";

import type { ReactNode } from "react";
import type { ProblemChatSessionSummary } from "@/features/problem-workspace/components/chat-panel/lib/chat-session-types";
import { ChatSessionHistoryItem } from "./chat-session-history-item";

export type ChatSessionHistoryProps = {
  sessions: ProblemChatSessionSummary[];
  isLoading?: boolean;
  activeSessionId?: string | null;
  onSelectSession?: (sessionId: string) => void;
};

export function ChatSessionHistory({
  sessions,
  isLoading = false,
  activeSessionId = null,
  onSelectSession,
}: ChatSessionHistoryProps) {
  let body: ReactNode;

  if (isLoading) {
    body = (
      <p className="px-3 py-4 text-muted-foreground text-sm">Loading chats…</p>
    );
  } else if (sessions.length === 0) {
    body = (
      <p className="px-3 py-4 text-muted-foreground text-sm">No previous chats yet</p>
    );
  } else {
    body = sessions.map((session) => (
      <ChatSessionHistoryItem
        isActive={session.id === activeSessionId}
        key={session.id}
        onSelect={onSelectSession}
        session={session}
      />
    ));
  }

  return (
    <section aria-label="Chat history" className="max-h-64 overflow-y-auto">
      {body}
    </section>
  );
}
