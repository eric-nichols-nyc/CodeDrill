import type { UIMessage } from "ai";
import type {
  PostProblemChatMessageRequest,
  ProblemChatStreamEvent,
} from "./problem-chat-types";

type ParsedChatStreamRequest = {
  upstreamBody: PostProblemChatMessageRequest;
  originalMessages?: UIMessage[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseMetadata(
  value: unknown
): PostProblemChatMessageRequest["metadata"] | undefined {
  if (!isRecord(value)) {
    return;
  }

  const metadata: NonNullable<PostProblemChatMessageRequest["metadata"]> = {};
  if (typeof value.code === "string") {
    metadata.code = value.code;
  }
  if (typeof value.language === "string") {
    metadata.language = value.language;
  }

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

function textFromUiMessage(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function parseThreadId(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Mirrors DefaultChatTransport body merge (extra transport body + SDK fields). */
export function mergeDefaultChatTransportBody(input: {
  transportBody?: Record<string, unknown>;
  chatId: string;
  messages: UIMessage[];
  trigger: "submit-message" | "regenerate-message";
  messageId?: string;
}): Record<string, unknown> {
  return {
    ...input.transportBody,
    id: input.chatId,
    messages: input.messages,
    trigger: input.trigger,
    messageId: input.messageId,
  };
}

/** Accept `{ content }` (curl) or `useChat` `{ messages }` bodies. */
export function parseChatStreamRequestBody(
  body: unknown
): ParsedChatStreamRequest | null {
  if (!isRecord(body)) {
    return null;
  }

  const threadId = parseThreadId(body.threadId);

  if (typeof body.content === "string") {
    const content = body.content.trim();
    if (!content) {
      return null;
    }

    return {
      upstreamBody: {
        content,
        threadId,
        metadata: parseMetadata(body.metadata),
      },
    };
  }

  if (!Array.isArray(body.messages)) {
    return null;
  }

  const originalMessages = body.messages as UIMessage[];
  const lastUserMessage = [...originalMessages]
    .reverse()
    .find((message) => message.role === "user");

  if (!lastUserMessage) {
    return null;
  }

  const content = textFromUiMessage(lastUserMessage);
  if (!content) {
    return null;
  }

  return {
    upstreamBody: {
      content,
      threadId,
      metadata: parseMetadata(body.metadata),
    },
    originalMessages,
  };
}

/** Parse one Nest SSE `data:` line into a stream event. */
export function parseProblemChatStreamEventLine(
  line: string
): ProblemChatStreamEvent | null {
  const prefix = "data: ";
  if (!line.startsWith(prefix)) {
    return null;
  }

  const payload = line.slice(prefix.length).trim();
  if (payload.length === 0) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload) as ProblemChatStreamEvent;
    if (
      parsed.type === "text-delta" ||
      parsed.type === "finish" ||
      parsed.type === "error"
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}
