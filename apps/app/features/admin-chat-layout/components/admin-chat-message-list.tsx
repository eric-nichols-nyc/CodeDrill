"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@repo/design-system/components/ai-elements/conversation";
import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
} from "@repo/design-system/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@repo/design-system/components/ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@repo/design-system/components/ai-elements/sources";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@repo/design-system/components/ai-elements/tool";
import type {
  AdminChatMessage,
  AdminChatToolType,
} from "@/features/admin-chat-layout/lib/admin-chat-types";

export type AdminChatMessageListProps = {
  messages: AdminChatMessage[];
};

export function AdminChatMessageList({ messages }: AdminChatMessageListProps) {
  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent>
        {messages.map(({ versions, ...message }) => (
          <MessageBranch defaultBranch={0} key={message.key}>
            <MessageBranchContent>
              {versions.map((version) => (
                <Message
                  from={message.from}
                  key={`${message.key}-${version.id}`}
                >
                  <div>
                    {message.sources?.length ? (
                      <Sources>
                        <SourcesTrigger count={message.sources.length} />
                        <SourcesContent>
                          {message.sources.map((source) => (
                            <Source
                              href={source.href}
                              key={source.href}
                              title={source.title}
                            />
                          ))}
                        </SourcesContent>
                      </Sources>
                    ) : null}
                    {message.tools?.map((tool) => (
                      <Tool key={`${message.key}-${tool.name}`}>
                        <ToolHeader
                          state={tool.status}
                          title={tool.description}
                          type={`tool-${tool.name}` as AdminChatToolType}
                        />
                        <ToolContent>
                          <ToolInput input={tool.parameters} />
                          <ToolOutput
                            errorText={tool.error}
                            output={tool.result}
                          />
                        </ToolContent>
                      </Tool>
                    ))}
                    {message.reasoning ? (
                      <Reasoning duration={message.reasoning.duration}>
                        <ReasoningTrigger />
                        <ReasoningContent>
                          {message.reasoning.content}
                        </ReasoningContent>
                      </Reasoning>
                    ) : null}
                    <MessageContent>
                      <MessageResponse>{version.content}</MessageResponse>
                    </MessageContent>
                  </div>
                </Message>
              ))}
            </MessageBranchContent>
            {versions.length > 1 ? (
              <MessageBranchSelector from={message.from}>
                <MessageBranchPrevious />
                <MessageBranchPage />
                <MessageBranchNext />
              </MessageBranchSelector>
            ) : null}
          </MessageBranch>
        ))}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
