"use client";

import type { PromptInputMessage } from "@repo/design-system/components/ai-elements/prompt-input";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  adminChatInitialMessages,
  adminChatMockResponses,
  adminChatModels,
} from "@/features/admin-chat-layout/lib/admin-chat-static-data";
import type {
  AdminChatMessage,
  AdminChatStatus,
} from "@/features/admin-chat-layout/lib/admin-chat-types";

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export function useStaticAdminChat() {
  const [model, setModel] = useState(adminChatModels[0]?.id ?? "");
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [text, setText] = useState("");
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [status, setStatus] = useState<AdminChatStatus>("ready");
  const [messages, setMessages] = useState<AdminChatMessage[]>(
    adminChatInitialMessages
  );

  const selectedModelData = useMemo(
    () => adminChatModels.find((item) => item.id === model),
    [model]
  );

  const updateMessageContent = useCallback(
    (messageId: string, newContent: string) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.versions.some((version) => version.id === messageId)) {
            return {
              ...msg,
              versions: msg.versions.map((version) =>
                version.id === messageId
                  ? { ...version, content: newContent }
                  : version
              ),
            };
          }
          return msg;
        })
      );
    },
    []
  );

  const streamResponse = useCallback(
    async (messageId: string, content: string) => {
      setStatus("streaming");

      const words = content.split(" ");
      let currentContent = "";

      for (const [index, word] of words.entries()) {
        currentContent += (index > 0 ? " " : "") + word;
        updateMessageContent(messageId, currentContent);
        await delay(Math.random() * 100 + 50);
      }

      setStatus("ready");
    },
    [updateMessageContent]
  );

  const addUserMessage = useCallback(
    (content: string) => {
      const userMessage: AdminChatMessage = {
        from: "user",
        key: `user-${Date.now()}`,
        versions: [
          {
            content,
            id: `user-${Date.now()}`,
          },
        ],
      };

      setMessages((prev) => [...prev, userMessage]);

      setTimeout(() => {
        const assistantMessageId = `assistant-${Date.now()}`;
        const randomResponse =
          adminChatMockResponses[
            Math.floor(Math.random() * adminChatMockResponses.length)
          ] ?? adminChatMockResponses[0];

        const assistantMessage: AdminChatMessage = {
          from: "assistant",
          key: `assistant-${Date.now()}`,
          versions: [
            {
              content: "",
              id: assistantMessageId,
            },
          ],
        };

        setMessages((prev) => [...prev, assistantMessage]);
        void streamResponse(assistantMessageId, randomResponse);
      }, 500);
    },
    [streamResponse]
  );

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const hasText = Boolean(message.text.trim());
      const hasAttachments = Boolean(message.files?.length);

      if (!(hasText || hasAttachments)) {
        return;
      }

      setStatus("submitted");

      if (message.files?.length) {
        toast.success("Files attached", {
          description: `${message.files.length} file(s) attached to message`,
        });
      }

      addUserMessage(message.text || "Sent with attachments");
      setText("");
    },
    [addUserMessage]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setStatus("submitted");
      addUserMessage(suggestion);
    },
    [addUserMessage]
  );

  const handleTranscriptionChange = useCallback((transcript: string) => {
    setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  }, []);

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value);
    },
    []
  );

  const toggleWebSearch = useCallback(() => {
    setUseWebSearch((prev) => !prev);
  }, []);

  const handleModelSelect = useCallback((modelId: string) => {
    setModel(modelId);
    setModelSelectorOpen(false);
  }, []);

  const isSubmitDisabled = useMemo(
    () => !text.trim() || status === "streaming",
    [text, status]
  );

  return {
    handleModelSelect,
    handleSubmit,
    handleSuggestionClick,
    handleTextChange,
    handleTranscriptionChange,
    isSubmitDisabled,
    messages,
    model,
    modelSelectorOpen,
    selectedModelData,
    setModelSelectorOpen,
    status,
    text,
    toggleWebSearch,
    useWebSearch,
  };
}
