import "server-only";

import { catalogUpstreamHeaders } from "@/lib/auth/catalog-upstream-headers";
import { apiBaseUrl } from "@/lib/auth/api-url";

export type ProblemsListResult = {
  ok: boolean;
  status: number;
  body: unknown;
};

export async function fetchProblemsList(): Promise<ProblemsListResult> {
  const base = apiBaseUrl();

  try {
    const res = await fetch(`${base}/problems`, {
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
