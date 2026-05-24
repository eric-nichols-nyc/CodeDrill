import { describe, expect, it } from "vitest";
import {
  parseChatStreamRequestBody,
  parseProblemChatStreamEventLine,
} from "@/features/problem-workspace/chatbot/lib/parse-problem-chat-stream-request";

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

    it("returns null for invalid bodies", () => {
      expect(parseChatStreamRequestBody(null)).toBeNull();
      expect(parseChatStreamRequestBody({ content: "   " })).toBeNull();
      expect(parseChatStreamRequestBody({ messages: [] })).toBeNull();
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
