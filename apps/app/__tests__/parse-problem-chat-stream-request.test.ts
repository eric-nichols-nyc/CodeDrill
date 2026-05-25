import { describe, expect, it } from "vitest";
import {
  mergeDefaultChatTransportBody,
  parseChatStreamRequestBody,
  parseProblemChatStreamEventLine,
} from "@/features/problem-workspace/chat-panel/lib/parse-problem-chat-stream-request";

describe("parse-problem-chat-stream-request", () => {
  describe("parseChatStreamRequestBody", () => {
    it("accepts direct content bodies", () => {
      expect(
        parseChatStreamRequestBody({ content: "  hello  ", metadata: { code: "x" } })
      ).toEqual({
        upstreamBody: { content: "hello", metadata: { code: "x" } },
      });
    });

    it("accepts useChat messages bodies", () => {
      expect(
        parseChatStreamRequestBody({
          messages: [
            {
              id: "1",
              role: "user",
              parts: [{ type: "text", text: "Need a hint" }],
            },
          ],
        })
      ).toEqual({
        upstreamBody: { content: "Need a hint" },
        originalMessages: [
          {
            id: "1",
            role: "user",
            parts: [{ type: "text", text: "Need a hint" }],
          },
        ],
      });
    });

    it("accepts useChat bodies with threadId (DefaultChatTransport merged shape)", () => {
      const messages = [
        {
          id: "1",
          role: "user" as const,
          parts: [{ type: "text" as const, text: "give me a hint" }],
        },
      ];

      const mergedBody = mergeDefaultChatTransportBody({
        transportBody: { threadId: "thread-1" },
        chatId: "problem-1:thread-1",
        messages,
        trigger: "submit-message",
        messageId: "1",
      });

      expect(parseChatStreamRequestBody(mergedBody)).toEqual({
        upstreamBody: {
          content: "give me a hint",
          threadId: "thread-1",
        },
        originalMessages: messages,
      });
    });

    it("returns null for invalid bodies", () => {
      expect(parseChatStreamRequestBody(null)).toBeNull();
      expect(parseChatStreamRequestBody({ content: "   " })).toBeNull();
      expect(parseChatStreamRequestBody({ messages: [] })).toBeNull();
      // Regression: threadId-only body (missing messages) must not parse.
      expect(parseChatStreamRequestBody({ threadId: "thread-1" })).toBeNull();
    });
  });

  describe("parseProblemChatStreamEventLine", () => {
    it("parses nest stream events", () => {
      expect(
        parseProblemChatStreamEventLine(
          'data: {"type":"text-delta","delta":"Hi"}'
        )
      ).toEqual({ type: "text-delta", delta: "Hi" });
    });
  });
});
