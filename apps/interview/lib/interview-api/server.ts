import "server-only";

import { apiAuthHeaders } from "@/lib/auth/api-auth-headers";
import { apiBaseUrl } from "@/lib/auth/api-url";

export class InterviewApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "InterviewApiError";
    this.status = status;
    this.body = body;
  }
}

export async function interviewApiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const authHeaders = await apiAuthHeaders();
  if (!authHeaders) {
    throw new InterviewApiError(401, "NOT_SIGNED_IN", null);
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", authHeaders.Authorization);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  let body: unknown = null;
  if (text.length > 0) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as { message: unknown }).message === "string"
        ? (body as { message: string }).message
        : `Request failed (${response.status})`;
    throw new InterviewApiError(response.status, message, body);
  }

  return body as T;
}
