import {
  createProblemChatThreadAction,
  getProblemChatMessagesAction,
  listProblemChatThreadsAction,
  postProblemChatMessageAction,
} from "../actions/problem-chat.actions";
import type {
  CreateProblemChatThreadResponse,
  GetProblemChatMessagesResponse,
  GetProblemChatThreadsResponse,
  PostProblemChatMessageRequest,
  PostProblemChatMessageResponse,
} from "./problem-chat-types";

function unwrap<T>(result: { ok: true; data: T } | { ok: false; error: string }): T {
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.data;
}

/** Load thread + message history for a problem (server action). */
export async function getProblemChatMessages(
  problemId: string,
  threadId?: string
): Promise<GetProblemChatMessagesResponse> {
  return unwrap(await getProblemChatMessagesAction(problemId, threadId));
}

/** List chat thread summaries for a problem (server action). */
export async function listProblemChatThreads(
  problemId: string
): Promise<GetProblemChatThreadsResponse> {
  return unwrap(await listProblemChatThreadsAction(problemId));
}

/** Create an empty chat thread for a problem (server action). */
export async function createProblemChatThread(
  problemId: string
): Promise<CreateProblemChatThreadResponse> {
  return unwrap(await createProblemChatThreadAction(problemId));
}

/** Send a user message and receive the persisted tutor reply (server action). */
export async function postProblemChatMessage(
  problemId: string,
  body: PostProblemChatMessageRequest
): Promise<PostProblemChatMessageResponse> {
  return unwrap(await postProblemChatMessageAction(problemId, body));
}
