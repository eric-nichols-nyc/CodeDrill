import { verifyToken } from "@clerk/backend";
import type { IncomingHttpHeaders } from "node:http";
import { headerValue } from "./http-headers";
import { getSessionFromHeaders } from "./session-from-headers";

function clerkAuthorizedParties(): string[] {
  return (process.env.CLERK_AUTHORIZED_PARTIES ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/**
 * Practice user id for guards: Clerk JWT `sub` first, then Better Auth session (legacy).
 * `sub` matches `user.id` when the Clerk webhook has provisioned the row.
 */
export async function resolvePracticeUserId(
  headers: IncomingHttpHeaders
): Promise<string | null> {
  const secretKey = process.env.CLERK_SECRET_KEY?.trim();
  const authorization = headerValue(headers, "authorization");

  if (secretKey && authorization) {
    const token = authorization.replace(/^Bearer\s+/i, "").trim();
    if (token) {
      try {
        const parties = clerkAuthorizedParties();
        const payload = await verifyToken(token, {
          secretKey,
          ...(parties.length > 0 ? { authorizedParties: parties } : {}),
        });
        if (payload.sub) {
          return payload.sub;
        }
      } catch {
        // fall through to Better Auth
      }
    }
  }

  const session = await getSessionFromHeaders(headers);
  return session?.user?.id ?? null;
}
