import type { NextRequest } from "next/server";

/** Neon Auth (Next handler) uses cookies prefixed with `__Secure-neon-auth` on HTTPS. */
export function hasNeonAuthSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some(
    (c) =>
      c.name.includes("neon-auth") &&
      (c.name.includes("session_token") || c.name.includes("session"))
  );
}
