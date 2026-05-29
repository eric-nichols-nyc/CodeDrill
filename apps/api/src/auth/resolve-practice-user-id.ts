import { verifyToken } from "@clerk/backend";
import type { IncomingHttpHeaders } from "node:http";
import { headerValue } from "./http-headers";

function clerkAuthorizedParties(): string[] {
  return (process.env.CLERK_AUTHORIZED_PARTIES ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/**
 * Practice user id for guards: the Clerk JWT `sub`, which matches `user.id`
 * once the Clerk webhook has provisioned the row. Returns `null` when no valid
 * Clerk Bearer token is present.
 */
export async function resolvePracticeUserId(
  headers: IncomingHttpHeaders
): Promise<string | null> {
  const secretKey = process.env.CLERK_SECRET_KEY?.trim();
  const authorization = headerValue(headers, "authorization");

  if (!secretKey || !authorization) {
    return null;
  }

  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return null;
  }

  try {
    const parties = clerkAuthorizedParties();
    const payload = await verifyToken(token, {
      secretKey,
      ...(parties.length > 0 ? { authorizedParties: parties } : {}),
    });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
