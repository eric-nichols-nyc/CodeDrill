"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Toaster } from "@repo/design-system/components/ui/sonner";
import { cn } from "@repo/design-system/lib/utils";
import { X } from "lucide-react";
import { AdminChatInput } from "@/features/admin-chat-layout/components/admin-chat-input";
import { AdminChatMessageList } from "@/features/admin-chat-layout/components/admin-chat-message-list";
import { useStaticAdminChat } from "@/features/admin-chat-layout/hooks/use-static-admin-chat";

export type AdminChatPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AdminChatPanel({ isOpen, onClose }: AdminChatPanelProps) {
  const chat = useStaticAdminChat();

  return (
    <aside
      aria-hidden={!isOpen}
      aria-label="Admin AI chat"
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-border border-l bg-background shadow-lg transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
      id="admin-ai-panel"
      role="dialog"
    >
      <Toaster position="top-center" richColors />
      <header className="flex shrink-0 items-center justify-between gap-2 border-border border-b px-4 py-3">
        <h2 className="font-medium text-sm">Ask AI</h2>
        <Button
          aria-label="Close AI chat"
          onClick={onClose}
          size="icon"
          type="button"
          variant="ghost"
        >
          <X className="size-4" />
        </Button>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col divide-y overflow-hidden">
        <AdminChatMessageList messages={chat.messages} />
        <AdminChatInput
          model={chat.model}
          modelSelectorOpen={chat.modelSelectorOpen}
          onModelSelect={chat.handleModelSelect}
          onModelSelectorOpenChange={chat.setModelSelectorOpen}
          onSubmit={chat.handleSubmit}
          onSuggestionClick={chat.handleSuggestionClick}
          onTextChange={chat.handleTextChange}
          onTranscriptionChange={chat.handleTranscriptionChange}
          onToggleWebSearch={chat.toggleWebSearch}
          selectedModelData={chat.selectedModelData}
          status={chat.status}
          submitDisabled={chat.isSubmitDisabled}
          text={chat.text}
          useWebSearch={chat.useWebSearch}
        />
      </div>
    </aside>
  );
}
