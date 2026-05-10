"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import { Gauge, Timer, RefreshCw, Send } from "lucide-react";
import { useState } from "react";

type RateLimitState = {
  remaining: number | null;
  resetInSeconds: number | null;
  error: string | null;
  message: string | null;
};

export default function RateLimitingPage() {
  const [state, setState] = useState<RateLimitState>({
    remaining: null,
    resetInSeconds: null,
    error: null,
    message: null,
  });
  const [loading, setLoading] = useState(false);

  async function triggerRateLimit() {
    setLoading(true);
    setState({ remaining: null, resetInSeconds: null, error: null, message: null });
    try {
      const res = await fetch("/api/rate-limit", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setState({
          remaining: data.remaining ?? 0,
          resetInSeconds: data.resetInSeconds ?? null,
          error: data.error ?? data.message ?? `HTTP ${res.status}`,
          message: null,
        });
        return;
      }
      setState({
        remaining: data.remaining ?? null,
        resetInSeconds: data.resetInSeconds ?? null,
        error: null,
        message: data.message ?? "OK",
      });
    } catch (e) {
      setState({
        remaining: null,
        resetInSeconds: null,
        error: e instanceof Error ? e.message : "Request failed",
        message: null,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">Rate limiting</h1>
          <p className="mt-2 text-muted-foreground">
            Limit requests per client with fixed window, sliding window, or token bucket
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why rate limiting?</CardTitle>
            <CardDescription>
              Without limits, a single client (or bot) can send thousands of requests per second and exhaust your server, run up costs, or abuse features like signup or password reset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              <strong>Example:</strong> A signup form might allow 5 submissions per 10 minutes per IP. That’s enough for a real user who made a typo or changed their mind, but it stops a script from creating hundreds of fake accounts or spamming your “forgot password” flow. Similarly, an API might allow 100 requests per minute per key so legitimate apps work fine while runaway scripts or scrapers get throttled. Rate limiting protects availability and cost without blocking normal traffic.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Timer className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Fixed window</CardTitle>
              </div>
              <CardDescription>
                Simple limit over a fixed time window (e.g. 100 requests per 60s).
                Use <code className="rounded bg-muted px-1 py-0.5 text-sm">fixedWindow</code> from{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">@/lib/arcjet</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-muted-foreground text-xs">
                fixedWindow(&#123; mode: &quot;LIVE&quot;, max: 100, window: &quot;60s&quot; &#125;)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Sliding window</CardTitle>
              </div>
              <CardDescription>
                Smoother limits with a moving window. Use{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">slidingWindow</code> for
                signup forms and APIs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-muted-foreground text-xs">
                slidingWindow(&#123; mode: &quot;LIVE&quot;, max: 5, interval: &quot;10m&quot; &#125;)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Gauge className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Token bucket</CardTitle>
              </div>
              <CardDescription>
                Burst-friendly: capacity refills at a rate. Use{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">tokenBucket</code> and pass{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">&#123; requested: 1 &#125;</code> to{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">protect()</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-muted-foreground text-xs">
                tokenBucket(&#123; refillRate: 10, interval: 10, capacity: 20 &#125;)
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Try it</CardTitle>
            <CardDescription>
              This endpoint allows <strong>2 requests per 60 seconds</strong> per IP. Click the button to call{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">POST /api/rate-limit</code>. After 2 requests you’ll see a 429 and remaining will show 0.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={triggerRateLimit} disabled={loading}>
              {loading ? "Sending…" : "Send request"}
              <Send className="ml-2 size-4" />
            </Button>
            {(state.remaining !== null || state.error !== null || state.message !== null) && (
              <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 text-sm">
                {state.error ? (
                  <p className="font-medium text-destructive">{state.error}</p>
                ) : null}
                {state.error === null && state.message !== null && state.message !== "" ? (
                  <p className="text-muted-foreground">{state.message}</p>
                ) : null}
                {state.remaining !== null && (
                  <p>
                    <strong>Requests left:</strong>{" "}
                    <span className={state.remaining === 0 ? "font-medium text-destructive" : ""}>
                      {state.remaining}
                    </span>
                  </p>
                )}
                {state.resetInSeconds !== null && state.resetInSeconds !== undefined && state.resetInSeconds > 0 && (
                  <p className="text-muted-foreground">
                    Limit resets in {state.resetInSeconds} seconds
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Using in a route</CardTitle>
            <CardDescription>
              Add rules with <code className="rounded bg-muted px-1 py-0.5 text-sm">.withRule([...])</code> on the base
              client, then call <code className="rounded bg-muted px-1 py-0.5 text-sm">protect(request)</code> in your
              handler or middleware.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-muted-foreground text-sm">
{`import aj, { fixedWindow } from "@/lib/arcjet";

const protectedAj = aj.withRule([
  fixedWindow({ mode: "LIVE", max: 100, window: "60s" }),
]);

export async function GET(req: Request) {
  const decision = await protectedAj.protect(req);
  if (decision.isDenied()) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }
  return Response.json({ ok: true });
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
