import { NextResponse } from "next/server";
import { keys } from "@/lib/auth/keys";
import { getNeonAuth } from "@/lib/auth/server";
import { neonUserId } from "@/lib/auth/neon-user-id";
import {
  problemsApiBaseUrl,
  upstreamUserHeaders,
} from "@/lib/problems/upstream-user-headers";

type RouteContext = { params: Promise<{ problemId: string }> };

function unauthorized(
  error: string,
  code: string,
  hint?: string
): NextResponse {
  return NextResponse.json({ error, code, ...(hint ? { hint } : {}) }, {
    status: 401,
  });
}

export async function GET(_request: Request, context: RouteContext) {
  const auth = await upstreamUserHeaders();
  if (!auth) {
    const { session, user } = await getNeonAuth();
    if (session && !neonUserId(user)) {
      return unauthorized(
        "Could not resolve your user id.",
        "INVALID_SESSION"
      );
    }
    return unauthorized(
      "Sign in to save and restore your code.",
      "NOT_SIGNED_IN"
    );
  }

  const { problemId } = await context.params;
  const upstream = await fetch(
    `${problemsApiBaseUrl()}/problems/${encodeURIComponent(problemId)}/workspace-code`,
    { headers: auth, cache: "no-store" }
  );

  const text = await upstream.text();

  if (upstream.status === 401) {
    const internalSecret = keys().INTERNAL_PROBLEMS_SECRET;
    if (!internalSecret) {
      return unauthorized(
        "Workspace code API rejected the request.",
        "MISSING_INTERNAL_SECRET",
        "Set INTERNAL_PROBLEMS_SECRET in apps/app/.env.local and apps/api/.env (same value)."
      );
    }
    return unauthorized(
      text || "Workspace code API rejected the request.",
      "UPSTREAM_UNAUTHORIZED",
      "Ensure INTERNAL_PROBLEMS_SECRET matches on the Nest API and restart both servers."
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
  const auth = await upstreamUserHeaders();
  if (!auth) {
    const { session, user } = await getNeonAuth();
    if (session && !neonUserId(user)) {
      return unauthorized(
        "Could not resolve your user id.",
        "INVALID_SESSION"
      );
    }
    return unauthorized(
      "Sign in to save your code across sessions.",
      "NOT_SIGNED_IN"
    );
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

  const upstream = await fetch(
    `${problemsApiBaseUrl()}/problems/${encodeURIComponent(problemId)}/workspace-code`,
    {
      method: "PUT",
      headers: {
        ...auth,
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    }
  );

  const text = await upstream.text();

  if (upstream.status === 401) {
    const internalSecret = keys().INTERNAL_PROBLEMS_SECRET;
    if (!internalSecret) {
      return unauthorized(
        "Could not save code — API authorization failed.",
        "MISSING_INTERNAL_SECRET",
        "Set INTERNAL_PROBLEMS_SECRET in apps/app/.env.local and apps/api/.env (same value)."
      );
    }
    return unauthorized(
      text || "Could not save code — API authorization failed.",
      "UPSTREAM_UNAUTHORIZED",
      "Ensure INTERNAL_PROBLEMS_SECRET matches on the Nest API and restart both servers."
    );
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/json";

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}
