const MODEL_JSON_FENCE = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;

export function parseModelJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fence = trimmed.match(MODEL_JSON_FENCE);
  const inner = fence?.[1]?.trim() ?? trimmed;
  return JSON.parse(inner) as unknown;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  return value as Record<string, unknown>;
}

export function readOpenAiErrorMessage(completion: unknown, httpStatus: number): string {
  const root = asRecord(completion);
  const err = root?.error;
  const errRec = asRecord(err);
  const msg = errRec?.message;
  if (typeof msg === "string" && msg.length > 0) {
    return msg;
  }
  return `OpenAI error (${httpStatus})`;
}

export function readOpenAiAssistantContent(completion: unknown): string | null {
  const root = asRecord(completion);
  const choices = root?.choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    return null;
  }
  const first = asRecord(choices[0]);
  const message = asRecord(first?.message);
  const content = message?.content;
  return typeof content === "string" ? content : null;
}
