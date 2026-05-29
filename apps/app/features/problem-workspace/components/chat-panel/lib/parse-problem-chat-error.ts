import {
  ProblemChatApiError,
  type ProblemChatErrorCode,
} from "./problem-chat-errors";

type ErrorBody = {
  error?: unknown;
  message?: unknown;
  code?: unknown;
};

function nestErrorMessage(body: ErrorBody): string | undefined {
  const { message } = body;
  if (typeof message === "string" && message.length > 0) {
    return message;
  }
  if (Array.isArray(message)) {
    const parts = message.filter(
      (part): part is string => typeof part === "string" && part.length > 0
    );
    if (parts.length > 0) {
      return parts.join(", ");
    }
  }
  return undefined;
}

function parseErrorBody(text: string): ErrorBody | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as ErrorBody;
    }
  } catch {
    // plain text body
  }
  return null;
}

function toErrorCode(value: unknown): ProblemChatErrorCode | undefined {
  if (typeof value !== "string") {
    return;
  }
  const allowed: ProblemChatErrorCode[] = [
    "NOT_SIGNED_IN",
    "INVALID_SESSION",
    "NETWORK",
    "UNKNOWN",
  ];
  return allowed.includes(value as ProblemChatErrorCode)
    ? (value as ProblemChatErrorCode)
    : undefined;
}

export function problemChatErrorFromResponse(
  res: Response,
  bodyText: string
): ProblemChatApiError {
  const parsed = parseErrorBody(bodyText);
  const message =
    nestErrorMessage(parsed ?? {}) ||
    (typeof parsed?.error === "string" && parsed.error) ||
    bodyText.trim() ||
    `Request failed (HTTP ${res.status})`;

  return new ProblemChatApiError(message, {
    status: res.status,
    code: toErrorCode(parsed?.code) ?? defaultCodeForStatus(res.status),
  });
}

function defaultCodeForStatus(status: number): ProblemChatErrorCode {
  if (status === 401) {
    return "NOT_SIGNED_IN";
  }
  return "UNKNOWN";
}
