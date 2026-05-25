import "server-only";

import { apiAuthHeaders } from "@/lib/auth/api-auth-headers";
import { apiBaseUrl } from "@/lib/auth/api-url";
import { ProblemChatApiError } from "./problem-chat-errors";
import { problemChatErrorFromResponse } from "./parse-problem-chat-error";
import type {
  CreateProblemChatThreadResponse,
  GetProblemChatMessagesResponse,
  GetProblemChatThreadsResponse,
  PostProblemChatMessageRequest,
  PostProblemChatMessageResponse,
  ProblemChatMessageDto,
  ProblemChatSessionSummary,
  ProblemChatThreadDto,
} from "./problem-chat-types";

function emptyChatHistory(problemId: string): GetProblemChatMessagesResponse {
  const now = new Date().toISOString();
  return {
    thread: {
      id: "",
      userId: "",
      problemId,
      createdAt: now,
      updatedAt: now,
    },
    messages: [],
  };
}

async function readResponse(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

async function requireAuthHeaders(): Promise<Record<string, string>> {
  const auth = await apiAuthHeaders();
  if (auth) {
    return auth;
  }

  throw new ProblemChatApiError("Sign in to use the tutor.", {
    status: 401,
    code: "NOT_SIGNED_IN",
  });
}

function chatMessagesPath(problemId: string, threadId?: string): string {
  const base = `${apiBaseUrl()}/problems/${encodeURIComponent(problemId)}/chat/messages`;
  if (!threadId) {
    return base;
  }
  return `${base}?threadId=${encodeURIComponent(threadId)}`;
}

function chatThreadsPath(problemId: string): string {
  return `${apiBaseUrl()}/problems/${encodeURIComponent(problemId)}/chat/threads`;
}

function isProblemChatThreadDto(value: unknown): value is ProblemChatThreadDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.userId === "string" &&
    typeof o.problemId === "string" &&
    typeof o.createdAt === "string" &&
    typeof o.updatedAt === "string"
  );
}

function isProblemChatMessageDto(value: unknown): value is ProblemChatMessageDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.role === "string" &&
    typeof o.content === "string" &&
    (o.metadata === null || typeof o.metadata === "object") &&
    typeof o.createdAt === "string"
  );
}

function isGetProblemChatMessagesResponse(
  value: unknown
): value is GetProblemChatMessagesResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    isProblemChatThreadDto(o.thread) &&
    Array.isArray(o.messages) &&
    o.messages.every(isProblemChatMessageDto)
  );
}

function isPostProblemChatMessageResponse(
  value: unknown
): value is PostProblemChatMessageResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    isProblemChatThreadDto(o.thread) &&
    isProblemChatMessageDto(o.userMessage) &&
    isProblemChatMessageDto(o.assistantMessage)
  );
}

function isProblemChatSessionSummary(
  value: unknown
): value is ProblemChatSessionSummary {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    (o.title === null || typeof o.title === "string") &&
    (o.preview === null || typeof o.preview === "string") &&
    typeof o.createdAt === "string" &&
    typeof o.updatedAt === "string" &&
    typeof o.messageCount === "number"
  );
}

function isGetProblemChatThreadsResponse(
  value: unknown
): value is GetProblemChatThreadsResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    Array.isArray(o.threads) &&
    o.threads.every(isProblemChatSessionSummary)
  );
}

function isCreateProblemChatThreadResponse(
  value: unknown
): value is CreateProblemChatThreadResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return isProblemChatSessionSummary(o.thread);
}

async function upstreamFetch(
  path: string,
  init?: RequestInit,
  authHeaders?: Record<string, string>
): Promise<Response> {
  const auth = authHeaders ?? (await requireAuthHeaders());

  try {
    return await fetch(path, {
      ...init,
      headers: {
        ...auth,
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ProblemChatApiError("Could not reach the server.", {
      status: 0,
      code: "NETWORK",
    });
  }
}

async function parseJsonResponse<T>(
  res: Response,
  isValid: (value: unknown) => value is T,
  invalidMessage: string
): Promise<T> {
  const text = await readResponse(res);

  if (!res.ok) {
    throw problemChatErrorFromResponse(res, text);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new ProblemChatApiError(invalidMessage, {
      status: res.status,
    });
  }

  if (!isValid(body)) {
    throw new ProblemChatApiError(invalidMessage, {
      status: res.status,
    });
  }

  return body;
}

export async function getProblemChatMessages(
  problemId: string,
  threadId?: string
): Promise<GetProblemChatMessagesResponse> {
  const auth = await apiAuthHeaders();
  if (!auth) {
    return emptyChatHistory(problemId);
  }

  return parseJsonResponse(
    await upstreamFetch(chatMessagesPath(problemId, threadId), undefined, auth),
    isGetProblemChatMessagesResponse,
    "Invalid chat history response."
  );
}

export async function listProblemChatThreads(
  problemId: string
): Promise<GetProblemChatThreadsResponse> {
  return parseJsonResponse(
    await upstreamFetch(chatThreadsPath(problemId)),
    isGetProblemChatThreadsResponse,
    "Invalid chat threads response."
  );
}

export async function createProblemChatThread(
  problemId: string
): Promise<CreateProblemChatThreadResponse> {
  return parseJsonResponse(
    await upstreamFetch(chatThreadsPath(problemId), { method: "POST" }),
    isCreateProblemChatThreadResponse,
    "Invalid create chat thread response."
  );
}

export async function postProblemChatMessage(
  problemId: string,
  body: PostProblemChatMessageRequest
): Promise<PostProblemChatMessageResponse> {
  return parseJsonResponse(
    await upstreamFetch(chatMessagesPath(problemId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    isPostProblemChatMessageResponse,
    "Invalid chat message response."
  );
}
