import { NextResponse } from "next/server";
import { apiAuthHeaders } from "@/lib/auth/api-auth-headers";
import { apiBaseUrl } from "@/lib/auth/api-url";

type RouteContext = { params: Promise<{ problemId: string }> };

function unauthorized(error: string, code: string): NextResponse {
  return NextResponse.json({ error, code }, { status: 401 });
}

export async function GET(_request: Request, context: RouteContext) {
  const auth = await apiAuthHeaders();
  if (!auth) {
    return unauthorized(
      "Sign in to save notes across sessions.",
      "NOT_SIGNED_IN"
    );
  }

  const { problemId } = await context.params;
  const upstream = await fetch(
    `${apiBaseUrl()}/problems/${encodeURIComponent(problemId)}/notes`,
    { headers: auth, cache: "no-store" }
  );

  const text = await upstream.text();

  if (upstream.status === 401) {
    return unauthorized(
      text || "Notes API rejected the request.",
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

export async function PUT(request: Request, context: RouteContext) {
  const auth = await apiAuthHeaders();
  if (!auth) {
    return unauthorized(
      "Sign in to save notes across sessions.",
      "NOT_SIGNED_IN"
    );
  }

  const { problemId } = await context.params;
  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const upstream = await fetch(
    `${apiBaseUrl()}/problems/${encodeURIComponent(problemId)}/notes`,
    {
      method: "PUT",
      headers: { ...auth, "Content-Type": "application/json" },
      body,
    }
  );

  const text = await upstream.text();

  if (upstream.status === 401) {
    return unauthorized(
      text || "Notes API rejected the request.",
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
