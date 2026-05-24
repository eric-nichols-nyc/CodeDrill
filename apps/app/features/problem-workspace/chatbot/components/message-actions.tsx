"use client";

import {
  MessageAction,
  MessageActions,
} from "@repo/design-system/components/ai-elements/message";
import { cn } from "@repo/design-system/lib/utils";
import {
  CheckIcon,
  CopyIcon,
  PencilIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useCallback, useState } from "react";

export type MessageVote = "up" | "down";

export type MessageActionsBarProps = {
  role: "user" | "assistant";
  text: string;
  vote?: MessageVote | null;
  onEditMessage?: (text: string) => void;
  onVote?: (vote: MessageVote | null) => void;
};

export function MessageActionsBar({
  role,
  text,
  vote = null,
  onEditMessage,
  onVote,
}: MessageActionsBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!text.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }, [text]);

  const handleVote = useCallback(
    (next: MessageVote) => {
      // TODO: persist via API (problem_chat_message.metadata)
      onVote?.(vote === next ? null : next);
    },
    [onVote, vote]
  );

  return (
    <MessageActions
      className={cn(
        "opacity-0 transition-opacity group-hover/message:opacity-100 group-focus-within/message:opacity-100",
        role === "user" && "ml-auto justify-end"
      )}
    >
      <MessageAction
        label={copied ? "Copied" : "Copy"}
        onClick={() => void handleCopy()}
        tooltip={copied ? "Copied" : "Copy"}
      >
        {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      </MessageAction>

      {role === "user" ? (
        <MessageAction
          disabled={!onEditMessage}
          label="Edit"
          onClick={() => onEditMessage?.(text)}
          tooltip="Edit"
        >
          <PencilIcon className="size-3.5" />
        </MessageAction>
      ) : (
        <>
          <MessageAction
            aria-pressed={vote === "up"}
            label="Upvote"
            onClick={() => handleVote("up")}
            tooltip="Upvote"
            variant={vote === "up" ? "secondary" : "ghost"}
          >
            <ThumbsUpIcon className="size-3.5" />
          </MessageAction>
          <MessageAction
            aria-pressed={vote === "down"}
            label="Downvote"
            onClick={() => handleVote("down")}
            tooltip="Downvote"
            variant={vote === "down" ? "secondary" : "ghost"}
          >
            <ThumbsDownIcon className="size-3.5" />
          </MessageAction>
        </>
      )}
    </MessageActions>
  );
}
