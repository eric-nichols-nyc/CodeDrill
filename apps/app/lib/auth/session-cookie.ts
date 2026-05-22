import type { NextRequest } from "next/server";
import { AUTH_TOKEN_COOKIE } from "./token";

/** True when the request carries an API auth Bearer token cookie. */
export function hasApiAuthTokenCookie(request: NextRequest): boolean {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  return typeof token === "string" && token.length > 0;
}
