import { timingSafeEqual } from "node:crypto";
import type { IncomingHttpHeaders } from "node:http";
import { headerValue } from "../auth/http-headers";
import { resolvePracticeUserId } from "../auth/resolve-practice-user-id";

export type CatalogAccess = "public" | "privileged";

function timingSafeStringEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) {
    return false;
  }
  return timingSafeEqual(ba, bb);
}

function hasInternalProblemsSecret(headers: IncomingHttpHeaders): boolean {
  const configured = process.env.INTERNAL_PROBLEMS_SECRET?.trim();
  const headerSecret = headerValue(headers, "x-internal-problems-secret");

  return Boolean(
    configured &&
      headerSecret &&
      timingSafeStringEqual(headerSecret, configured)
  );
}

/**
 * Catalog reads are public by default (published problems only).
 * Clerk JWT or matching `x-internal-problems-secret` unlocks drafts / admin views.
 */
export async function resolveCatalogAccess(
  headers: IncomingHttpHeaders
): Promise<CatalogAccess> {
  if (hasInternalProblemsSecret(headers)) {
    return "privileged";
  }

  const userId = await resolvePracticeUserId(headers);
  if (userId) {
    return "privileged";
  }

  return "public";
}
