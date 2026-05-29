"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@repo/design-system/components/ai-elements/prompt-input";
import type { ChatSubmitStatus } from "@/features/problem-workspace/chat-panel/lib/message-list-utils";

export type ChatInputProps = {
  hasProblemId: boolean;
  isSending: boolean;
  submitStatus?: ChatSubmitStatus;
  onSubmit: (message: PromptInputMessage) => void | Promise<void>;
  editDraft?: string;
  editDraftKey?: number;
  /** When true, input is disabled with sign-in copy (unsigned tutor). */
  signedOut?: boolean;
};

export function ChatInput({
  hasProblemId,
  isSending,
  submitStatus,
  onSubmit,
  editDraft,
  editDraftKey = 0,
  signedOut = false,
}: ChatInputProps) {
  const enabled = hasProblemId && !signedOut;

  return (
    <PromptInputProvider initialInput={editDraft ?? ""} key={editDraftKey}>
      <PromptInput className="m-2 mt-0" onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            disabled={!enabled || isSending}
            placeholder={
              signedOut
                ? "Sign in to use the tutor."
                : hasProblemId
                  ? "Type a message…"
                  : "Chat unavailable for this problem."
            }
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit
            disabled={!enabled || isSending}
            status={submitStatus}
          />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  );
}
