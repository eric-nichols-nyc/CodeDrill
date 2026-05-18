"use client";

import { useCallback, useEffect, useState } from "react";

export function useAdminChatLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!isChatOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatOpen, closeChat]);

  return {
    isChatOpen,
    openChat,
    closeChat,
    toggleChat,
  };
}
