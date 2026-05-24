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
import type { ChatSubmitStatus } from "@/features/problem-workspace/chatbot/lib/message-list-utils";

export type ChatInputProps = {
  hasProblemId: boolean;
  isSending: boolean;
  submitStatus: ChatSubmitStatus;
  onSubmit: (message: PromptInputMessage) => void | Promise<void>;
  editDraft?: string;
  editDraftKey?: number;
};

export function ChatInput({
  hasProblemId,
  isSending,
  submitStatus,
  onSubmit,
  editDraft,
  editDraftKey = 0,
}: ChatInputProps) {
  return (
    <PromptInputProvider initialInput={editDraft ?? ""} key={editDraftKey}>
      <PromptInput className="m-2 mt-0" onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            disabled={!hasProblemId || isSending}
            placeholder={
              hasProblemId
                ? "Type a message…"
                : "Chat unavailable for this problem."
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
  );
}
