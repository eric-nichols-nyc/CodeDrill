import { describe, expect, it } from "vitest";
import {
  historyDtoToUiMessages,
  problemChatStreamApiPath,
  textFromUiMessage,
} from "@/features/problem-workspace/chatbot/lib/problem-chat-ui-messages";

describe("problem-chat-ui-messages", () => {
  it("maps persisted messages to UIMessage parts", () => {
    expect(
      historyDtoToUiMessages([
        {
          id: "u1",
          role: "user",
          content: "Help",
          metadata: null,
          createdAt: "2026-01-01T00:00:00.000Z",
        },
        {
          id: "s1",
          role: "system",
          content: "hidden",
          metadata: null,
          createdAt: "2026-01-01T00:00:01.000Z",
        },
      ])
    ).toEqual([
      {
        id: "u1",
        role: "user",
        parts: [{ type: "text", text: "Help" }],
      },
    ]);
  });

  it("reads text back from ui messages", () => {
    expect(
      textFromUiMessage({
        id: "1",
        role: "assistant",
        parts: [{ type: "text", text: "Try two pointers." }],
      })
    ).toBe("Try two pointers.");
  });

  it("builds the stream api path", () => {
    expect(problemChatStreamApiPath("abc-123")).toBe(
      "/api/problems/abc-123/chat/stream"
    );
  });
});
