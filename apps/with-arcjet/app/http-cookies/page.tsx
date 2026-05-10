import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Cookie } from "lucide-react";

export default function HttpCookiesPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">HTTP cookies</h1>
          <p className="mt-2 text-muted-foreground">
            What they are and how they work
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cookie className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">What are HTTP cookies?</CardTitle>
            </div>
            <CardDescription>
              Cookies are small pieces of data (name-value pairs) that a server sends to the browser in the <code className="rounded bg-muted px-1 py-0.5 text-sm">Set-Cookie</code> response header. The browser stores them and sends them back with every subsequent request to that domain in the <code className="rounded bg-muted px-1 py-0.5 text-sm">Cookie</code> header.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              They let the server recognize the same client across requests without putting that state in the URL. Common uses: session IDs (so you stay logged in), user preferences (e.g. theme or language), and analytics. Cookies can have attributes like <code className="rounded bg-muted px-1 py-0.5 text-sm">HttpOnly</code> (not readable by JavaScript, reduces XSS risk), <code className="rounded bg-muted px-1 py-0.5 text-sm">Secure</code> (only over HTTPS), and <code className="rounded bg-muted px-1 py-0.5 text-sm">SameSite</code> (when to send on cross-site requests).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next.js example</CardTitle>
            <CardDescription>
              In the App Router, use <code className="rounded bg-muted px-1 py-0.5 text-sm">cookies()</code> from <code className="rounded bg-muted px-1 py-0.5 text-sm">next/headers</code> to read and set cookies in server components and route handlers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`import { cookies } from "next/headers";

// In a route handler or server component — set a cookie
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("preference", "dark", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });
  return Response.json({ ok: true });
}

// Read a cookie
export async function GET() {
  const cookieStore = await cookies();
  const preference = cookieStore.get("preference")?.value;
  return Response.json({ theme: preference ?? "light" });
}`}
            </pre>
            <p className="mt-4 text-muted-foreground text-sm">
              The browser will send the <code className="rounded bg-muted px-1 py-0.5 text-sm">Cookie</code> header on later requests automatically; you only read and set cookies on the server (or via an API that sets <code className="rounded bg-muted px-1 py-0.5 text-sm">Set-Cookie</code>).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
