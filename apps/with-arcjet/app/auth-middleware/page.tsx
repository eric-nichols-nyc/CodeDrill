import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Shield } from "lucide-react";

export default function AuthMiddlewarePage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">Auth middleware</h1>
          <p className="mt-2 text-muted-foreground">
            Protecting routes before they run
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">What is auth middleware?</CardTitle>
            </div>
            <CardDescription>
              Middleware runs before the request reaches your page or API route. You can check for a session (e.g. cookie or JWT), redirect unauthenticated users to sign-in, or return 401/403 so protected handlers never run.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              In Next.js, a <code className="rounded bg-muted px-1 py-0.5 text-sm">middleware.ts</code> (or <code className="rounded bg-muted px-1 py-0.5 text-sm">middleware.js</code>) at the project root runs on every request that matches its <code className="rounded bg-muted px-1 py-0.5 text-sm">matcher</code>. You can integrate with Auth.js, Clerk, or a custom cookie/JWT check. Keep the logic fast so it doesn’t add latency to every request.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next.js example</CardTitle>
            <CardDescription>
              In <code className="rounded bg-muted px-1 py-0.5 text-sm">middleware.ts</code>, read the session cookie and redirect or allow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SIGN_IN = "/sign-in";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard");

  if (isProtected && !session) {
    const signIn = new URL(SIGN_IN, req.url);
    signIn.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};`}
            </pre>
            <p className="mt-4 text-muted-foreground text-sm">
              For API routes you might return <code className="rounded bg-muted px-1 py-0.5 text-sm">NextResponse.json(&#123; error: "Unauthorized" &#125;, &#123; status: 401 &#125;)</code> instead of redirecting.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
