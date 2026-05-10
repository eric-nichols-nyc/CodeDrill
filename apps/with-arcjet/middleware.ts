import { NextResponse } from "next/server";
import aj from "@/lib/arcjet";

export async function middleware(request: Request) {
  try {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: "Too many requests", reason: "rate_limit" },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: "Forbidden", reason: decision.reason },
        { status: 403 }
      );
    }
  } catch (error) {
    // Allow request through when Arcjet fails (e.g. when proxied from multi-zone host)
    console.error("[arcjet middleware]", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
