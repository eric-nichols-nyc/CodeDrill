import { type NextRequest, NextResponse } from "next/server";
import { hasApiAuthTokenCookie } from "@/lib/auth/session-cookie";

export function proxy(request: NextRequest) {
  if (!hasApiAuthTokenCookie(request)) {
    const redirectUrl = new URL("/auth/sign-in", request.url);
    redirectUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/problems/:path*", "/account/:path*"],
};
