import "server-only";

import { keys } from "@/lib/auth/keys";
import { headers } from "next/headers";

const TRAILING_SLASH = /\/$/;

export type ProblemsListResult = {
  ok: boolean;
  status: number;
  body: unknown;
};

export async function fetchProblemsList(): Promise<ProblemsListResult> {
  const k = keys();
  const base = (k.NEON_JWT_API_URL ?? "http://localhost:3030").replace(TRAILING_SLASH, "");
  const h = await headers();
  const cookie = h.get("cookie");

  const res = await fetch(`${base}/problems`, {
    headers: {
      ...(cookie ? { Cookie: cookie } : {}),
      ...(k.INTERNAL_PROBLEMS_SECRET
        ? { "x-internal-problems-secret": k.INTERNAL_PROBLEMS_SECRET }
        : {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, body: JSON.parse(text) as unknown };
  } catch {
    return { ok: res.ok, status: res.status, body: text };
  }
}
