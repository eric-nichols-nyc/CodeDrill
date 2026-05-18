import { Button } from "@repo/design-system/components/ui/button";
import { MessageCircle } from "lucide-react";

export type AdminChatHeaderProps = {
  isChatOpen: boolean;
  onToggleChat: () => void;
};

export function AdminChatHeader({
  isChatOpen,
  onToggleChat,
}: AdminChatHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-border border-b bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <p className="font-medium text-sm">Problem Admin</p>
        <Button
          aria-controls="admin-ai-panel"
          aria-expanded={isChatOpen}
          onClick={onToggleChat}
          size="sm"
          type="button"
          variant="outline"
        >
          <MessageCircle className="size-4" />
          Ask AI
        </Button>
      </div>
    </header>
  );
}
