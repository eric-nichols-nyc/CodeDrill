import { NextResponse } from "next/server";
import { apiAuthHeaders } from "@/lib/auth/api-auth-headers";
import { apiBaseUrl } from "@/lib/auth/api-url";

type RouteContext = { params: Promise<{ problemId: string }> };

function unauthorized(error: string, code: string): NextResponse {
  return NextResponse.json({ error, code }, { status: 401 });
}

function progressUpstreamUrl(problemId: string): string {
  return `${apiBaseUrl()}/problems/${encodeURIComponent(problemId)}/progress`;
}

export async function GET(_request: Request, context: RouteContext) {
  const auth = await apiAuthHeaders();
  if (!auth) {
    return unauthorized("Sign in to view your progress.", "NOT_SIGNED_IN");
  }

  const { problemId } = await context.params;
  const upstream = await fetch(progressUpstreamUrl(problemId), {
    headers: auth,
    cache: "no-store",
  });

  const text = await upstream.text();

  if (upstream.status === 401) {
    return unauthorized(
      text || "Progress API rejected the request.",
      "UPSTREAM_UNAUTHORIZED"
    );
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/json";

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await apiAuthHeaders();
  if (!auth) {
    return unauthorized("Sign in to update your progress.", "NOT_SIGNED_IN");
  }

  const { problemId } = await context.params;
  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body", code: "UNKNOWN" }, {
      status: 400,
    });
  }

  const upstream = await fetch(progressUpstreamUrl(problemId), {
    method: "PATCH",
    headers: {
      ...auth,
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  });

  const text = await upstream.text();

  if (upstream.status === 401) {
    return unauthorized(
      text || "Could not save progress — API authorization failed.",
      "UPSTREAM_UNAUTHORIZED"
    );
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/json";

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}
