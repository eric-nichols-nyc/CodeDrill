"use client";

import { AdminChatHeader } from "@/features/admin-chat-layout/components/admin-chat-header";
import { AdminChatPanel } from "@/features/admin-chat-layout/components/admin-chat-panel";
import { useAdminChatLayout } from "@/features/admin-chat-layout/hooks/use-admin-chat-layout";

export type AdminChatLayoutProps = {
  children: React.ReactNode;
};

export function AdminChatLayout({ children }: AdminChatLayoutProps) {
  const { isChatOpen, closeChat, toggleChat } = useAdminChatLayout();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminChatHeader isChatOpen={isChatOpen} onToggleChat={toggleChat} />
      <main>{children}</main>
      <AdminChatPanel isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
}
