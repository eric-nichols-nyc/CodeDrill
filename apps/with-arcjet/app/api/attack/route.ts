import { type NextRequest, NextResponse } from "next/server";
import arcjet, { shield } from "@/lib/arcjet";

// Opt out of caching
export const dynamic = "force-dynamic";

// DRY_RUN: Shield evaluates and reports but does not block. Switch to LIVE to
// actually return 403 for suspicious requests. This lets the demo show that
// Shield distinguishes safe vs suspicious on the same endpoint.
const aj = arcjet.withRule(
  shield({
    mode: "DRY_RUN",
  })
);

export async function GET(req: NextRequest) {
  const decision = await aj.protect(req);

  if (decision.isErrored()) {
    if (decision.reason.message === "[unauthenticated] invalid key") {
      return NextResponse.json(
        {
          message:
            "Invalid Arcjet key. Is the ARCJET_KEY environment variable set?",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: `Internal server error: ${decision.reason.message}` },
      { status: 500 }
    );
  }

  // In DRY_RUN we always allow the request through, but we report Shield’s
  // decision so the UI can show "allowed" vs "would block".
  const shieldAllowed = !decision.isDenied();
  const reasonObj = decision.isDenied() ? decision.reason : null;
  const shieldReason =
    reasonObj !== null && typeof reasonObj === "object" && "message" in reasonObj
      ? String((reasonObj as { message?: unknown }).message)
      : reasonObj !== null
        ? String(reasonObj)
        : null;

  return NextResponse.json({
    message: shieldAllowed ? "Hello world" : "Request would be blocked in LIVE mode",
    shield: {
      allowed: shieldAllowed,
      wouldBlockInLive: !shieldAllowed,
      reason: shieldReason,
    },
  });
}
