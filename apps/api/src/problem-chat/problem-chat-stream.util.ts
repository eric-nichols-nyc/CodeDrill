import type { ProblemChatStreamEvent } from "./problem-chat.types";

type OpenAiStreamChunk = {
  choices?: Array<{
    delta?: {
      content?: string | null;
    };
  }>;
};

/** Write one SSE event (`data: …\\n\\n`) to the response. */
export function writeStreamEvent(
  write: (chunk: string) => void,
  event: ProblemChatStreamEvent
) {
  write(`data: ${JSON.stringify(event)}\n\n`);
}

/** Parse a single OpenAI streaming `data:` line; returns text delta or null. */
export function parseOpenAiStreamDataLine(line: string): string | null {
  const prefix = "data: ";
  if (!line.startsWith(prefix)) {
    return null;
  }

  const payload = line.slice(prefix.length).trim();
  if (payload.length === 0 || payload === "[DONE]") {
    return null;
  }

  let chunk: OpenAiStreamChunk;
  try {
    chunk = JSON.parse(payload) as OpenAiStreamChunk;
  } catch {
    return null;
  }

  const delta = chunk.choices?.[0]?.delta?.content;
  return typeof delta === "string" && delta.length > 0 ? delta : null;
}
