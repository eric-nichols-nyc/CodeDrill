"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@repo/design-system/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@repo/design-system/components/ai-elements/message";
import type { AdminChatMessage } from "@/features/admin-chat-layout/lib/admin-chat-types";

export type AdminChatMessageListProps = {
  messages: AdminChatMessage[];
};

export function AdminChatMessageList({ messages }: AdminChatMessageListProps) {
  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent>
        {messages.map((message) => (
          <Message from={message.role} key={message.id}>
            <MessageContent>
              <MessageResponse>{message.content}</MessageResponse>
            </MessageContent>
          </Message>
        ))}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
