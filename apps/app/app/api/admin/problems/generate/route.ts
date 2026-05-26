import { NextResponse } from "next/server";
import { apiBaseUrl } from "@/lib/auth/api-url";
import { catalogUpstreamHeaders } from "@/lib/auth/catalog-upstream-headers";
import { getApiAuth } from "@/lib/auth/server";

function normalizeUpstreamError(body: unknown): Record<string, unknown> {
  const record =
    typeof body === "object" && body !== null ? (body as Record<string, unknown>) : null;
  const message = record?.message;

  if (typeof message === "object" && message !== null && !Array.isArray(message)) {
    return message as Record<string, unknown>;
  }

  if (Array.isArray(message)) {
    const parts = message.filter((item): item is string => typeof item === "string");
    return { error: parts.join("; ") || "Request failed." };
  }

  if (typeof message === "string" && message.length > 0) {
    return { error: message };
  }

  if (typeof record?.error === "string" && typeof record?.statusCode === "number") {
    return { error: message ?? record.error };
  }

  return { error: "Request failed." };
}

export async function POST(request: Request) {
  const { session } = await getApiAuth();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const bodyText = await request.text();
  try {
    JSON.parse(bodyText) as unknown;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const upstream = await fetch(`${apiBaseUrl()}/problems/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await catalogUpstreamHeaders()),
    },
    body: bodyText,
  });

  const text = await upstream.text();
  let json: unknown;
  try {
    json = JSON.parse(text) as unknown;
  } catch {
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "text/plain",
      },
    });
  }

  if (!upstream.ok) {
    return NextResponse.json(normalizeUpstreamError(json), {
      status: upstream.status,
    });
  }

  return NextResponse.json(json, { status: upstream.status });
}
