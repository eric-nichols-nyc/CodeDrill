import { setRateLimitHeaders } from "@arcjet/decorate";
import { type NextRequest, NextResponse } from "next/server";
import arcjet, { fixedWindow, shield } from "@/lib/arcjet";

// Opt out of caching
export const dynamic = "force-dynamic";

// Add rules to the base Arcjet instance outside of the handler function
const aj = arcjet
  .withRule(
    // Shield detects suspicious behavior, such as SQL injection and cross-site
    // scripting attacks. We want to run on every request
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    })
  )
  .withRule(
    fixedWindow({
      // fingerprint requests by ip address (default unless set globally)
      characteristics: ["ip.src"],
      mode: "LIVE",
      max: 2,
      window: "60s",
    })
  );

function getRateLimitInfo(decision: Awaited<ReturnType<typeof aj.protect>>) {
  let message = "";
  let remaining: number | null = null;
  let resetInSeconds: number | null = null;

  if (decision.reason.isRateLimit()) {
    const reset = decision.reason.resetTime;
    remaining = decision.reason.remaining;
    if (reset !== undefined) {
      const seconds = Math.floor((reset.getTime() - Date.now()) / 1000);
      resetInSeconds = Math.max(0, seconds);
      message = seconds > 60 ? `Reset in ${Math.ceil(seconds / 60)} minutes.` : `Reset in ${seconds} seconds.`;
    }
  }
  if (remaining === null && !decision.isDenied() && decision.results) {
    const rateLimitResult = decision.results.find(
      (r) => r.ruleId === "fixed_window" || (r as { type?: string }).type === "RATE_LIMIT"
    );
    if (rateLimitResult && "remaining" in rateLimitResult) {
      remaining = (rateLimitResult as { remaining?: number }).remaining ?? null;
    }
  }
  return { message, remaining, resetInSeconds };
}

export async function POST(req: NextRequest) {
  const decision = await aj.protect(req);

  console.log("Arcjet decision: ", decision);

  const headers = new Headers();
  setRateLimitHeaders(headers, decision);

  const { message, remaining, resetInSeconds } = getRateLimitInfo(decision);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        {
          error: `Too many requests. ${message}`,
          remaining: 0,
          resetInSeconds,
        },
        { status: 429, headers }
      );
    }
    return NextResponse.json(
      { error: "Forbidden", ip: decision.ip },
      { status: 403, headers }
    );
  }
  if (decision.isErrored()) {
    console.error("Arcjet error:", decision.reason);

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

  return NextResponse.json(
    {
      message: `OK. ${remaining !== null ? `${remaining} requests remaining. ` : ""}${message}`.trim(),
      remaining: remaining ?? null,
      resetInSeconds,
    },
    { status: 200, headers }
  );
}
