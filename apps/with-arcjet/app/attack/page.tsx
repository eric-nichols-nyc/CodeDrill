"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Swords,
  Terminal,
} from "lucide-react";
import { useState } from "react";

type AttackResult = {
  status: number | null;
  message: string | null;
  error: string | null;
  shieldAllowed: boolean | null;
  shieldWouldBlockInLive: boolean | null;
  shieldReason: string | null;
};

export default function AttackPage() {
  const [result, setResult] = useState<AttackResult>({
    status: null,
    message: null,
    error: null,
    shieldAllowed: null,
    shieldWouldBlockInLive: null,
    shieldReason: null,
  });
  const [loading, setLoading] = useState(false);

  async function callAttackApi(url: string) {
    setLoading(true);
    setResult({
      status: null,
      message: null,
      error: null,
      shieldAllowed: null,
      shieldWouldBlockInLive: null,
      shieldReason: null,
    });
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setResult({
          status: res.status,
          message: null,
          error: data.error ?? data.message ?? `HTTP ${res.status}`,
          shieldAllowed: null,
          shieldWouldBlockInLive: null,
          shieldReason: null,
        });
        return;
      }
      setResult({
        status: res.status,
        message: data.message ?? "OK",
        error: null,
        shieldAllowed: data.shield?.allowed ?? null,
        shieldWouldBlockInLive: data.shield?.wouldBlockInLive ?? null,
        shieldReason: data.shield?.reason ?? null,
      });
    } catch (e) {
      setResult({
        status: null,
        message: null,
        error: e instanceof Error ? e.message : "Request failed",
        shieldAllowed: null,
        shieldWouldBlockInLive: null,
        shieldReason: null,
      });
    } finally {
      setLoading(false);
    }
  }

  function sendSafeRequest() {
    callAttackApi("/api/attack");
  }

  function sendSuspiciousRequest() {
    callAttackApi("/api/attack?q=1' OR '1'='1");
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">Attack protection</h1>
          <p className="mt-2 text-muted-foreground">
            Arcjet Shield and attack detection
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Swords className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Shield (WAF)</CardTitle>
            </div>
            <CardDescription>
              Arcjet Shield protects against common attacks including the OWASP
              Top 10. Add the{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                shield
              </code>{" "}
              rule from{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                @/lib/arcjet
              </code>{" "}
              to your route or middleware to enable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Example:{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                aj.withRule([shield(&#123; mode: &quot;LIVE&quot; &#125;)])
              </code>{" "}
              then call{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                protectedAj.protect(request)
              </code>{" "}
              in your handler.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">
                XSS (Cross-Site Scripting)
              </CardTitle>
            </div>
            <CardDescription>
              XSS is when an attacker injects malicious script (usually
              JavaScript) into a page so it runs in the victim’s browser. The
              script runs in the context of your site, so it can read cookies
              (including session cookies), change the page, or send data to the
              attacker.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground text-sm">
              It often happens when user-controlled data is reflected in the
              HTML without being escaped (e.g. a search query shown as “Results
              for &lt;script&gt;...&lt;/script&gt;”) or when stored input is
              later rendered as HTML. The browser can’t tell the difference
              between your markup and the injected script.
            </p>
            <p className="mb-1 font-medium text-muted-foreground text-sm">
              Common ways to prevent XSS:
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>Escape on output:</strong> When rendering user input as
                text, encode{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  &lt;
                </code>
                ,{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  &gt;
                </code>
                ,{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  &amp;
                </code>
                ,{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  &quot;
                </code>{" "}
                so the browser doesn’t interpret them as HTML/script. React does
                this by default when you use{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  &#123;userInput&#125;
                </code>
                .
              </li>
              <li>
                <strong>
                  Avoid{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    dangerouslySetInnerHTML
                  </code>{" "}
                  with raw user input:
                </strong>{" "}
                If you must render HTML from users, sanitize it first (e.g.
                allowlist of safe tags/attributes) or use a library like
                DOMPurify.
              </li>
              <li>
                <strong>HttpOnly cookies:</strong> Session cookies that are not
                readable by JavaScript limit what an XSS payload can steal (e.g.
                it can’t read the session cookie to impersonate the user).
              </li>
              <li>
                <strong>Content Security Policy (CSP):</strong> A response
                header that tells the browser which scripts are allowed to run
                (e.g. only from your domain or nonces), reducing the impact of
                injected script.
              </li>
              <li>
                <strong>Validate and sanitize on the server:</strong> Never
                trust the client; validate input shape and length, and sanitize
                or escape before storing and before rendering.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Try it</CardTitle>
            <CardDescription>
              The same{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                GET /api/attack
              </code>{" "}
              endpoint is protected by Arcjet Shield. Shield decides for each
              request: safe → allow, suspicious → block. Safe request (no attack
              pattern) gets 200; suspicious request (e.g. SQL injection–like
              query) gets blocked. Here Shield runs in DRY_RUN so you can see
              both outcomes; set{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                mode: &quot;LIVE&quot;
              </code>{" "}
              to actually return 403 for attacks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button disabled={loading} onClick={sendSafeRequest}>
                <ShieldCheck className="mr-2 size-4" />
                Safe request
              </Button>
              <Button
                disabled={loading}
                onClick={sendSuspiciousRequest}
                variant="outline"
              >
                <ShieldAlert className="mr-2 size-4" />
                Suspicious request (SQL injection pattern)
              </Button>
            </div>
            {(result.status !== null || result.error !== null) && (
              <div className="mt-4 space-y-2 rounded-lg border bg-muted/50 p-4 text-sm">
                {result.status !== null && (
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        result.status >= 400
                          ? "font-medium text-destructive"
                          : "text-green-600 dark:text-green-400"
                      }
                    >
                      {result.status}
                    </span>
                  </p>
                )}
                {result.error !== null ? (
                  <p className="font-medium text-destructive">{result.error}</p>
                ) : null}
                {result.error === null &&
                result.message !== null &&
                result.message !== "" ? (
                  <p className="text-muted-foreground">{result.message}</p>
                ) : null}
                {result.shieldAllowed !== null && (
                  <p>
                    <strong>Shield:</strong>{" "}
                    {result.shieldAllowed ? (
                      <span className="text-green-600 dark:text-green-400">
                        Allowed
                      </span>
                    ) : (
                      <span className="font-medium text-destructive">
                        Would block in LIVE mode
                        {result.shieldReason !== null &&
                        result.shieldReason !== ""
                          ? ` — ${result.shieldReason}`
                          : ""}
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <p className="mb-2 flex items-center gap-2 text-muted-foreground text-sm">
                <Terminal className="size-4" />
                Or run in your terminal (with the app running on port 3022):
              </p>
              <div className="space-y-2">
                <p className="font-medium text-muted-foreground text-xs">
                  Safe request:
                </p>
                <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs">
                  {typeof window !== "undefined"
                    ? `curl "${window.location.origin}/api/attack"`
                    : `curl "http://localhost:3022/api/attack"`}
                </pre>
                <p className="font-medium text-muted-foreground text-xs">
                  Suspicious request:
                </p>
                <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs">
                  {typeof window !== "undefined"
                    ? `curl "${window.location.origin}/api/attack?q=1' OR '1'='1"`
                    : `curl "http://localhost:3022/api/attack?q=1' OR '1'='1"`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
