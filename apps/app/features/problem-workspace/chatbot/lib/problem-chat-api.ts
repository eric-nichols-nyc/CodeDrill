import {
  getProblemChatMessagesAction,
  postProblemChatMessageAction,
} from "../actions/problem-chat.actions";
import type {
  GetProblemChatMessagesResponse,
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
  problemId: string
): Promise<GetProblemChatMessagesResponse> {
  return unwrap(await getProblemChatMessagesAction(problemId));
}

/** Send a user message and receive the persisted tutor reply (server action). */
export async function postProblemChatMessage(
  problemId: string,
  body: PostProblemChatMessageRequest
): Promise<PostProblemChatMessageResponse> {
  return unwrap(await postProblemChatMessageAction(problemId, body));
}
