import { keys } from "@/lib/auth/keys";
import { apiBaseUrl } from "@/lib/auth/api-url";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "te",
  "trailer",
  "upgrade",
  "host",
  "content-length",
]);

function proxyRequestHeaders(request: Request): Headers {
  const out = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      out.set(key, value);
    }
  });
  return out;
}

async function proxyAuthRequest(
  request: Request,
  pathSegments: string[]
): Promise<Response> {
  keys();
  const base = apiBaseUrl();
  const url = new URL(request.url);
  const target = `${base}/api/auth/${pathSegments.join("/")}${url.search}`;

  const res = await fetch(target, {
    method: request.method,
    headers: proxyRequestHeaders(request),
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text(),
  });

  const headers = new Headers();
  res.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  return new Response(res.body, { status: res.status, headers });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return proxyAuthRequest(request, path);
}

export async function POST(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return proxyAuthRequest(request, path);
}
