"use client";

import { cn } from "@repo/design-system/lib/utils";
import type { ProblemChatSessionSummary } from "@/features/problem-workspace/chat-panel/lib/chat-session-types";

function formatSessionDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export type ChatSessionHistoryItemProps = {
  session: ProblemChatSessionSummary;
  isActive?: boolean;
  onSelect?: (sessionId: string) => void;
};

export function ChatSessionHistoryItem({
  session,
  isActive = false,
  onSelect,
}: ChatSessionHistoryItemProps) {
  const title = session.title?.trim() || "Untitled chat";
  const preview = session.preview?.trim();
  const updatedLabel = formatSessionDate(session.updatedAt);
  const itemClassName = cn(
    "flex w-full flex-col gap-0.5 border-border border-b px-3 py-2 text-left text-sm transition-colors last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    isActive
      ? "bg-accent text-accent-foreground hover:bg-accent"
      : "hover:bg-accent/50"
  );

  return (
    <button
      className={itemClassName}
      onClick={() => onSelect?.(session.id)}
      type="button"
    >
      <div className="flex min-w-0 items-baseline justify-between gap-2">
        <span className="truncate font-medium">{title}</span>
        {updatedLabel ? (
          <span className="shrink-0 text-muted-foreground text-xs">{updatedLabel}</span>
        ) : null}
      </div>

      {preview ? (
        <span className="line-clamp-2 text-muted-foreground text-xs">{preview}</span>
      ) : (
        <span className="text-muted-foreground text-xs">
          {session.messageCount === 1 ? "1 message" : `${session.messageCount} messages`}
        </span>
      )}
    </button>
  );
}
