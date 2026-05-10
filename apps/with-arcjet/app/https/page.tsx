import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Lock } from "lucide-react";

export default function HttpsPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">HTTPS</h1>
          <p className="mt-2 text-muted-foreground">
            Encrypting traffic in transit
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lock className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Why HTTPS?</CardTitle>
            </div>
            <CardDescription>
              HTTPS is HTTP over TLS: the connection between browser and server is encrypted and authenticated. That prevents eavesdropping and tampering (e.g. on public Wi‑Fi) and ensures the client is talking to the real server.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Cookies marked <code className="rounded bg-muted px-1 py-0.5 text-sm">Secure</code> are only sent over HTTPS. In production, serve the app over HTTPS (hosting platforms usually provide it and redirect HTTP → HTTPS). For local dev, <code className="rounded bg-muted px-1 py-0.5 text-sm">next dev</code> uses HTTP; you can use a local TLS proxy or <code className="rounded bg-muted px-1 py-0.5 text-sm">Secure</code> only in production so cookies work in both environments.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example: Secure cookies and redirect</CardTitle>
            <CardDescription>
              Set <code className="rounded bg-muted px-1 py-0.5 text-sm">secure: true</code> when in production, and optionally redirect HTTP to HTTPS in middleware.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`// Only send cookie over HTTPS in production
cookieStore.set("session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});

// Optional: redirect HTTP to HTTPS in middleware (if not done by host)
export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === "production" && req.headers.get("x-forwarded-proto") !== "https") {
    return NextResponse.redirect("https://" + req.headers.get("host") + req.nextUrl.pathname);
  }
  return NextResponse.next();
}`}
            </pre>
            <p className="mt-4 text-muted-foreground text-sm">
              On Vercel, Netlify, etc., the platform handles TLS and often sets <code className="rounded bg-muted px-1 py-0.5 text-sm">x-forwarded-proto</code>; use that if you need to detect HTTPS behind a proxy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
