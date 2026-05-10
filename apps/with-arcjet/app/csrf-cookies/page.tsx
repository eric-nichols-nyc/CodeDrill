import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function CsrfCookiesPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">CSRF cookies</h1>
          <p className="mt-2 text-muted-foreground">
            Cross-Site Request Forgery and how cookies relate
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">What is CSRF?</CardTitle>
            </div>
            <CardDescription>
              Cross-Site Request Forgery: an attacker tricks a user’s browser into sending a request to your site (e.g. change password, transfer money) while the user is logged in. The browser automatically sends session cookies, so the server thinks the request is legitimate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Defenses include: <strong>SameSite cookies</strong> (<code className="rounded bg-muted px-1 py-0.5 text-sm">SameSite=Strict</code> or <code className="rounded bg-muted px-1 py-0.5 text-sm">Lax</code>) so the browser doesn’t send the cookie on cross-site requests; <strong>CSRF tokens</strong> — the server issues a secret token in the page (or a cookie), and state-changing requests must send it back so the server can verify the request came from your UI, not a forged form on another site.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example: SameSite + token</CardTitle>
            <CardDescription>
              Set cookies with <code className="rounded bg-muted px-1 py-0.5 text-sm">sameSite: "lax"</code> or <code className="rounded bg-muted px-1 py-0.5 text-sm">"strict"</code>, and validate a CSRF token on POST/PUT/DELETE.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`import { cookies } from "next/headers";
import { randomBytes } from "crypto";

const CSRF_COOKIE = "csrf_token";

export async function GET() {
  const token = randomBytes(32).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax", // or "strict" — not sent on cross-site POSTs
    secure: true,
    path: "/",
  });
  return Response.json({ csrfToken: token }); // or render in form
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const body = await req.json();
  const expected = cookieStore.get(CSRF_COOKIE)?.value;
  if (!expected || body._csrf !== expected) {
    return Response.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
  // proceed with mutation...
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
