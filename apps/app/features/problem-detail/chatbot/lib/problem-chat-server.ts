import "server-only";

import { keys } from "@/lib/auth/keys";
import {
  problemsApiBaseUrl,
  upstreamUserHeaders,
} from "@/lib/problems/upstream-user-headers";
import { getNeonAuth } from "@/lib/auth/server";
import { neonUserId } from "@/lib/auth/neon-user-id";
import { ProblemChatApiError } from "./problem-chat-errors";
import { problemChatErrorFromResponse } from "./parse-problem-chat-error";
import type {
  GetProblemChatMessagesResponse,
  PostProblemChatMessageRequest,
  PostProblemChatMessageResponse,
  ProblemChatMessageDto,
  ProblemChatThreadDto,
} from "./problem-chat-types";

/**
 * Dev-only: set PROBLEM_CHAT_DEV_USER_ID + INTERNAL_PROBLEMS_SECRET to test chat
 * without Neon Auth / Better Auth wired up. Any non-empty user id string works.
 */
async function resolveChatUpstreamHeaders(): Promise<
  Record<string, string> | null
> {
  const fromSession = await upstreamUserHeaders();
  if (fromSession) {
    return fromSession;
  }

  const devUserId =
    process.env.PROBLEM_CHAT_DEV_USER_ID?.trim() ??
    (process.env.NODE_ENV === "development" ? "dev-local-user" : undefined);
  const internalSecret = keys().INTERNAL_PROBLEMS_SECRET;
  if (devUserId && internalSecret) {
    return {
      "x-user-id": devUserId,
      "x-internal-problems-secret": internalSecret,
    };
  }

  return null;
}

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
  const auth = await resolveChatUpstreamHeaders();
  if (auth) {
    return auth;
  }

  const { session, user } = await getNeonAuth();
  if (session && !neonUserId(user)) {
    throw new ProblemChatApiError("Could not resolve your user id.", {
      status: 401,
      code: "INVALID_SESSION",
    });
  }

  throw new ProblemChatApiError("Sign in to use the tutor.", {
    status: 401,
    code: "NOT_SIGNED_IN",
  });
}

function chatMessagesPath(problemId: string): string {
  return `${problemsApiBaseUrl()}/problems/${encodeURIComponent(problemId)}/chat/messages`;
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

async function upstreamFetch(
  problemId: string,
  init?: RequestInit,
  authHeaders?: Record<string, string>
): Promise<Response> {
  const auth = authHeaders ?? (await requireAuthHeaders());

  try {
    return await fetch(chatMessagesPath(problemId), {
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

export async function getProblemChatMessages(
  problemId: string
): Promise<GetProblemChatMessagesResponse> {
  const auth = await resolveChatUpstreamHeaders();
  if (!auth) {
    return emptyChatHistory(problemId);
  }

  const res = await upstreamFetch(problemId, undefined, auth);
  const text = await readResponse(res);

  if (!res.ok) {
    throw problemChatErrorFromResponse(res, text);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new ProblemChatApiError("Invalid chat history response.", {
      status: res.status,
    });
  }

  if (!isGetProblemChatMessagesResponse(body)) {
    throw new ProblemChatApiError("Invalid chat history response.", {
      status: res.status,
    });
  }

  return body;
}

export async function postProblemChatMessage(
  problemId: string,
  body: PostProblemChatMessageRequest
): Promise<PostProblemChatMessageResponse> {
  const res = await upstreamFetch(problemId, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await readResponse(res);

  if (!res.ok) {
    throw problemChatErrorFromResponse(res, text);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ProblemChatApiError("Invalid chat message response.", {
      status: res.status,
    });
  }

  if (!isPostProblemChatMessageResponse(parsed)) {
    throw new ProblemChatApiError("Invalid chat message response.", {
      status: res.status,
    });
  }

  return parsed;
}
