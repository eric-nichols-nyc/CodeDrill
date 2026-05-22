import { fromNodeHeaders } from "better-auth/node";
import type { IncomingHttpHeaders } from "node:http";
import { auth } from "../auth";

/** Resolves a Better Auth session from cookies or `Authorization: Bearer` (bearer plugin). */
export async function getSessionFromHeaders(headers: IncomingHttpHeaders) {
  return auth.api.getSession({
    headers: fromNodeHeaders(headers),
  });
}
