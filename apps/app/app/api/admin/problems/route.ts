import { NextResponse } from "next/server";
import { createProblemBodySchema } from "@/features/admin/lib/create-problem-schema";
import { apiBaseUrl } from "@/lib/auth/api-url";
import { catalogUpstreamHeaders } from "@/lib/auth/catalog-upstream-headers";
import { getApiAuth } from "@/lib/auth/server";

export async function POST(request: Request) {
  const { session } = await getApiAuth();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createProblemBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const upstreamHeaders = await catalogUpstreamHeaders();

  const upstream = await fetch(`${apiBaseUrl()}/problems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...upstreamHeaders,
    },
    body: JSON.stringify(parsed.data),
  });

  const text = await upstream.text();
  const contentType =
    upstream.headers.get("content-type") ?? "application/json";

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}
