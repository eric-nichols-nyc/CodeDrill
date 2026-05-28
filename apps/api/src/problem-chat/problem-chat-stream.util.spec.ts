import {
  parseOpenAiStreamDataLine,
  writeStreamEvent,
} from "./problem-chat-stream.util";

describe("problem-chat-stream.util", () => {
  describe("writeStreamEvent", () => {
    it("writes SSE data lines", () => {
      const chunks: string[] = [];
      writeStreamEvent((chunk) => {
        chunks.push(chunk);
      }, { type: "text-delta", delta: "hi" });

      expect(chunks).toEqual(['data: {"type":"text-delta","delta":"hi"}\n\n']);
    });
  });

  describe("parseOpenAiStreamDataLine", () => {
    it("extracts content deltas from OpenAI stream lines", () => {
      expect(
        parseOpenAiStreamDataLine(
          'data: {"choices":[{"delta":{"content":"Hello"}}]}'
        )
      ).toBe("Hello");
    });

    it("returns null for done and non-data lines", () => {
      expect(parseOpenAiStreamDataLine("data: [DONE]")).toBeNull();
      expect(parseOpenAiStreamDataLine(": keep-alive")).toBeNull();
      expect(parseOpenAiStreamDataLine("data: not-json")).toBeNull();
    });
  });
});
