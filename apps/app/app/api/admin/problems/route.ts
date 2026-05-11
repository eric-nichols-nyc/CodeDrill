import { createProblemBodySchema } from "@/lib/admin/create-problem-schema";
import { getNeonAuth } from "@/lib/auth/server";
import { keys } from "@/lib/auth/keys";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const TRAILING_SLASH = /\/$/;

function apiBaseUrl(): string {
  const fromEnv = keys().NEON_JWT_API_URL;
  const base = (fromEnv ?? "http://localhost:3030").replace(TRAILING_SLASH, "");
  return base;
}

export async function POST(request: Request) {
  const { session } = await getNeonAuth();
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

  const h = await headers();
  const cookie = h.get("cookie");
  const internalSecret = keys().INTERNAL_PROBLEMS_SECRET;

  const upstream = await fetch(`${apiBaseUrl()}/problems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...(internalSecret
        ? { "x-internal-problems-secret": internalSecret }
        : {}),
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
