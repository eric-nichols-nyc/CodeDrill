"use server";

import { ProblemChatApiError } from "../lib/problem-chat-errors";
import {
  createProblemChatThread,
  getProblemChatMessages,
  listProblemChatThreads,
  postProblemChatMessage,
} from "../lib/problem-chat-server";
import type {
  CreateProblemChatThreadResponse,
  GetProblemChatMessagesResponse,
  GetProblemChatThreadsResponse,
  PostProblemChatMessageRequest,
  PostProblemChatMessageResponse,
  ProblemChatActionResult,
} from "../lib/problem-chat-types";

function toActionError(error: unknown): ProblemChatActionResult<never> {
  if (error instanceof ProblemChatApiError) {
    return { ok: false, error: error.userMessage };
  }
  if (error instanceof Error && error.message.length > 0) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: "Something went wrong. Try again." };
}

export async function getProblemChatMessagesAction(
  problemId: string,
  threadId?: string
): Promise<ProblemChatActionResult<GetProblemChatMessagesResponse>> {
  try {
    return {
      ok: true,
      data: await getProblemChatMessages(problemId, threadId),
    };
  } catch (error) {
    return toActionError(error);
  }
}

export async function listProblemChatThreadsAction(
  problemId: string
): Promise<ProblemChatActionResult<GetProblemChatThreadsResponse>> {
  try {
    return { ok: true, data: await listProblemChatThreads(problemId) };
  } catch (error) {
    return toActionError(error);
  }
}

export async function createProblemChatThreadAction(
  problemId: string
): Promise<ProblemChatActionResult<CreateProblemChatThreadResponse>> {
  try {
    return { ok: true, data: await createProblemChatThread(problemId) };
  } catch (error) {
    return toActionError(error);
  }
}

export async function postProblemChatMessageAction(
  problemId: string,
  body: PostProblemChatMessageRequest
): Promise<ProblemChatActionResult<PostProblemChatMessageResponse>> {
  try {
    return { ok: true, data: await postProblemChatMessage(problemId, body) };
  } catch (error) {
    return toActionError(error);
  }
}
