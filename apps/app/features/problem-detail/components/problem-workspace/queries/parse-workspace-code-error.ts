import {
  WorkspaceCodeApiError,
  type WorkspaceCodeErrorCode,
} from "./workspace-code-errors";

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

function toErrorCode(value: unknown): WorkspaceCodeErrorCode | undefined {
  if (typeof value !== "string") {
    return;
  }
  const allowed: WorkspaceCodeErrorCode[] = [
    "NOT_SIGNED_IN",
    "INVALID_SESSION",
    "MISSING_INTERNAL_SECRET",
    "UPSTREAM_UNAUTHORIZED",
    "NETWORK",
    "UNKNOWN",
  ];
  return allowed.includes(value as WorkspaceCodeErrorCode)
    ? (value as WorkspaceCodeErrorCode)
    : undefined;
}

export function workspaceCodeErrorFromResponse(
  res: Response,
  bodyText: string
): WorkspaceCodeApiError {
  const parsed = parseErrorBody(bodyText);
  const message =
    (typeof parsed?.error === "string" && parsed.error) ||
    (typeof parsed?.message === "string" && parsed.message) ||
    bodyText.trim() ||
    `Request failed (HTTP ${res.status})`;

  return new WorkspaceCodeApiError(message, {
    status: res.status,
    code: toErrorCode(parsed?.code) ?? defaultCodeForStatus(res.status),
    hint: typeof parsed?.hint === "string" ? parsed.hint : undefined,
  });
}

function defaultCodeForStatus(status: number): WorkspaceCodeErrorCode {
  if (status === 401) {
    return "UPSTREAM_UNAUTHORIZED";
  }
  return "UNKNOWN";
}
