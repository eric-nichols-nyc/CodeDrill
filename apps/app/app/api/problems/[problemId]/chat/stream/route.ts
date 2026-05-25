import { NextResponse } from "next/server";
import { createProblemChatBffStreamResponse } from "@/features/problem-workspace/chat-note-panel/lib/problem-chat-stream-server";
import { parseChatStreamRequestBody } from "@/features/problem-workspace/chat-note-panel/lib/parse-problem-chat-stream-request";
import { apiAuthHeaders } from "@/lib/auth/api-auth-headers";

export const maxDuration = 120;

type RouteContext = { params: Promise<{ problemId: string }> };

function unauthorized(error: string, code: string): NextResponse {
  return NextResponse.json({ error, code }, { status: 401 });
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await apiAuthHeaders();
  if (!auth) {
    return unauthorized("Sign in to use the tutor.", "NOT_SIGNED_IN");
  }

  const { problemId } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body.", code: "INVALID_BODY" },
      { status: 400 }
    );
  }

  const parsed = parseChatStreamRequestBody(body);
  if (!parsed) {
    return NextResponse.json(
      {
        error: 'Request must include non-empty "content" or a user "messages" entry.',
        code: "INVALID_BODY",
      },
      { status: 400 }
    );
  }

  return createProblemChatBffStreamResponse({
    problemId,
    auth,
    upstreamBody: parsed.upstreamBody,
    originalMessages: parsed.originalMessages,
  });
}
