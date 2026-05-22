import { NextResponse } from "next/server";
import { createProblemBodySchema } from "@/features/admin/lib/create-problem-schema";
import { apiBaseUrl } from "@/lib/auth/api-url";
import { catalogUpstreamHeaders } from "@/lib/auth/catalog-upstream-headers";
import { getApiAuth } from "@/lib/auth/server";

async function requireCatalogHeaders() {
  const { session } = await getApiAuth();
  if (!session) {
    return null;
  }
  return catalogUpstreamHeaders();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireCatalogHeaders();
  if (!auth) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id } = await params;
  const upstream = await fetch(
    `${apiBaseUrl()}/problems/${encodeURIComponent(id)}/details`,
    {
      headers: auth,
      cache: "no-store",
    }
  );

  const text = await upstream.text();
  const contentType =
    upstream.headers.get("content-type") ?? "application/json";

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireCatalogHeaders();
  if (!auth) {
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

  const { id } = await params;
  const upstream = await fetch(
    `${apiBaseUrl()}/problems/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...auth,
      },
      body: JSON.stringify(parsed.data),
    }
  );

  const text = await upstream.text();
  const contentType =
    upstream.headers.get("content-type") ?? "application/json";

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}
