"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/components/ui/popover";
import { cn } from "@repo/design-system/lib/utils";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { usePageContext } from "@/contexts/page-context";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatbotProps = {
  context?: string;
};

export const Chatbot = ({ context: propContext }: ChatbotProps) => {
  // Get context from page context provider, fallback to prop
  const { context: contextFromProvider } = usePageContext();
  const context = contextFromProvider || propContext;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className="fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open chatbot</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex h-[80vh] w-[90vw] max-w-2xl flex-col p-0 sm:h-[85vh]"
        side="top"
        sideOffset={12}
      >
        <div className="border-b p-4">
          <h3 className="font-semibold">SOLID Principles Assistant</h3>
          <p className="text-muted-foreground text-sm">
            Ask questions about SOLID principles and the code examples
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div className="space-y-2">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  Start a conversation by asking a question about SOLID
                  principles
                </p>
                <p className="text-muted-foreground text-xs">
                  Try: &quot;What is the inversion in DIP?&quot;
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  className={cn(
                    "flex w-full",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                  key={message.id}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading ? (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-muted px-4 py-2 text-sm">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t p-4">
          <Input
            className="flex-1"
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            value={input}
          />
          <Button
            disabled={isLoading || !input.trim()}
            onClick={sendMessage}
            size="icon"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
