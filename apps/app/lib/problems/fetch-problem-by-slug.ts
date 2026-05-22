import "server-only";

import { catalogUpstreamHeaders } from "@/lib/auth/catalog-upstream-headers";
import { apiBaseUrl } from "@/lib/auth/api-url";

export type ProblemDetailResult = {
  ok: boolean;
  status: number;
  body: unknown;
};

export async function fetchProblemBySlug(slug: string): Promise<ProblemDetailResult> {
  const base = apiBaseUrl();
  const path = `${base}/problems/by-slug/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(path, {
      headers: await catalogUpstreamHeaders(),
      cache: "no-store",
    });

    const text = await res.text();
    try {
      return { ok: res.ok, status: res.status, body: JSON.parse(text) as unknown };
    } catch {
      return { ok: res.ok, status: res.status, body: text };
    }
  } catch {
    return { ok: false, status: 0, body: null };
  }
}
