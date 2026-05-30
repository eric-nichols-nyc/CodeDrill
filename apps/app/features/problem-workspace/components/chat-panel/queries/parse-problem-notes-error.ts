import {
  ProblemNotesApiError,
  type ProblemNotesErrorCode,
} from "./problem-notes-errors";

type ErrorBody = {
  error?: unknown;
  message?: unknown;
  code?: unknown;
  hint?: unknown;
};

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

function toErrorCode(value: unknown): ProblemNotesErrorCode | undefined {
  if (typeof value !== "string") {
    return;
  }
  const allowed: ProblemNotesErrorCode[] = [
    "NOT_SIGNED_IN",
    "INVALID_SESSION",
    "MISSING_INTERNAL_SECRET",
    "UPSTREAM_UNAUTHORIZED",
    "NETWORK",
    "UNKNOWN",
  ];
  return allowed.includes(value as ProblemNotesErrorCode)
    ? (value as ProblemNotesErrorCode)
    : undefined;
}

export function problemNotesErrorFromResponse(
  res: Response,
  bodyText: string
): ProblemNotesApiError {
  const parsed = parseErrorBody(bodyText);
  const message =
    (typeof parsed?.error === "string" && parsed.error) ||
    (typeof parsed?.message === "string" && parsed.message) ||
    bodyText.trim() ||
    `Request failed (HTTP ${res.status})`;

  return new ProblemNotesApiError(message, {
    status: res.status,
    code: toErrorCode(parsed?.code) ?? defaultCodeForStatus(res.status),
    hint: typeof parsed?.hint === "string" ? parsed.hint : undefined,
  });
}

function defaultCodeForStatus(status: number): ProblemNotesErrorCode {
  if (status === 401) {
    return "UPSTREAM_UNAUTHORIZED";
  }
  return "UNKNOWN";
}
