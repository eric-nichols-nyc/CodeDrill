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

export type AdminChatInputProps = {
  onSubmit: (message: PromptInputMessage) => void;
};

export function AdminChatInput({ onSubmit }: AdminChatInputProps) {
  return (
    <PromptInputProvider>
      <PromptInput className="m-2 mt-0 shrink-0" onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea placeholder="Ask about problem wording, hints, tests..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  );
}
