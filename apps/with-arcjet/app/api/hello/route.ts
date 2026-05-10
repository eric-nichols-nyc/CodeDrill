import aj from "@/lib/arcjet";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    message: "Hello from Arcjet-protected API",
    timestamp: new Date().toISOString(),
  });
}
