"use client";

import type { PromptInputMessage } from "@repo/design-system/components/ai-elements/prompt-input";
import { useCallback, useState } from "react";
import type { AdminChatMessage } from "@/features/admin-chat-layout/lib/admin-chat-types";

const INITIAL_GREETING =
  "Hi, I can help you think through problem wording, examples, hints, and test cases.";

const STATIC_ASSISTANT_RESPONSE =
  "Static AI response for now. Later this can call the admin assistant endpoint.";

function createMessage(
  role: AdminChatMessage["role"],
  content: string
): AdminChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date(),
  };
}

export function useStaticAdminChat() {
  const [messages, setMessages] = useState<AdminChatMessage[]>(() => [
    createMessage("assistant", INITIAL_GREETING),
  ]);

  const submitMessage = useCallback((message: PromptInputMessage) => {
    const trimmed = message.text.trim();
    if (!trimmed) {
      return;
    }

    setMessages((current) => [
      ...current,
      createMessage("user", trimmed),
      createMessage("assistant", STATIC_ASSISTANT_RESPONSE),
    ]);
  }, []);

  return {
    messages,
    submitMessage,
  };
}
