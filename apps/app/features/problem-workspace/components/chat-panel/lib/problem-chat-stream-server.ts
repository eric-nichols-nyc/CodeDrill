import "server-only";

import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  type UIMessage,
  type UIMessageStreamWriter,
} from "ai";
import { apiBaseUrl } from "@/lib/auth/api-url";
import type { PostProblemChatMessageRequest } from "./problem-chat-types";
import { parseProblemChatStreamEventLine } from "./parse-problem-chat-stream-request";
import type { ProblemChatStreamEvent } from "./problem-chat-types";

function chatStreamUpstreamUrl(problemId: string): string {
  return `${apiBaseUrl()}/problems/${encodeURIComponent(problemId)}/chat/messages/stream`;
}

function applyNestStreamEvent(
  event: ProblemChatStreamEvent,
  writer: UIMessageStreamWriter<UIMessage>,
  textPartId: string,
  started: { value: boolean }
) {
  if (event.type === "text-delta") {
    if (!started.value) {
      writer.write({ type: "text-start", id: textPartId });
      started.value = true;
    }
    writer.write({
      type: "text-delta",
      id: textPartId,
      delta: event.delta,
    });
    return;
  }

  if (event.type === "error") {
    writer.write({ type: "error", errorText: event.message });
  }
}

async function pipeNestSseToUiStream(
  upstream: Response,
  writer: UIMessageStreamWriter<UIMessage>,
  textPartId: string
) {
  if (!upstream.body) {
    writer.write({
      type: "error",
      errorText: "The tutor stream ended before any response was received.",
    });
    return;
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const started = { value: false };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const event = parseProblemChatStreamEventLine(line);
      if (!event) {
        continue;
      }

      applyNestStreamEvent(event, writer, textPartId, started);
    }
  }

  if (started.value) {
    writer.write({ type: "text-end", id: textPartId });
  }
}

export async function createProblemChatBffStreamResponse(input: {
  problemId: string;
  auth: Record<string, string>;
  upstreamBody: PostProblemChatMessageRequest;
  originalMessages?: UIMessage[];
}) {
  const upstream = await fetch(chatStreamUpstreamUrl(input.problemId), {
    method: "POST",
    headers: {
      ...input.auth,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(input.upstreamBody),
    cache: "no-store",
  });

  if (upstream.status === 401) {
    const text = await upstream.text().catch(() => "");
    return Response.json(
      {
        error: text || "Chat API rejected the request.",
        code: "UPSTREAM_UNAUTHORIZED",
      },
      { status: 401 }
    );
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return Response.json(
      {
        error: text || "Could not start the tutor stream.",
        code: "UPSTREAM_ERROR",
      },
      { status: upstream.status }
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  if (!contentType.includes("text/event-stream")) {
    const text = await upstream.text().catch(() => "");
    return Response.json(
      {
        error: text || "Tutor API did not return a stream.",
        code: "INVALID_UPSTREAM_RESPONSE",
      },
      { status: 502 }
    );
  }

  const textPartId = generateId();
  const upstreamForPipe = upstream;

  const stream = createUIMessageStream({
    originalMessages: input.originalMessages,
    execute: async ({ writer }) => {
      await pipeNestSseToUiStream(upstreamForPipe, writer, textPartId);
    },
  });

  return createUIMessageStreamResponse({ stream });
}
