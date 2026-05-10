import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Globe } from "lucide-react";

export default function CorsPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">CORS</h1>
          <p className="mt-2 text-muted-foreground">
            Cross-Origin Resource Sharing
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Globe className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">What is CORS?</CardTitle>
            </div>
            <CardDescription>
              Browsers enforce the same-origin policy: a page from <code className="rounded bg-muted px-1 py-0.5 text-sm">https://app.example.com</code> can’t normally call <code className="rounded bg-muted px-1 py-0.5 text-sm">https://api.other.com</code> via JavaScript. CORS is a way for the API server to tell the browser “these other origins are allowed to call me.”
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              The server sends <code className="rounded bg-muted px-1 py-0.5 text-sm">Access-Control-Allow-Origin</code> (and optionally <code className="rounded bg-muted px-1 py-0.5 text-sm">Allow-Methods</code>, <code className="rounded bg-muted px-1 py-0.5 text-sm">Allow-Headers</code>, <code className="rounded bg-muted px-1 py-0.5 text-sm">Allow-Credentials</code>). For non-simple requests, the browser first sends a preflight <code className="rounded bg-muted px-1 py-0.5 text-sm">OPTIONS</code> request; the server must respond with the right CORS headers for the browser to allow the actual request.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next.js example</CardTitle>
            <CardDescription>
              Add CORS headers in middleware or in each route handler. For APIs that accept credentials (cookies), use a specific origin and <code className="rounded bg-muted px-1 py-0.5 text-sm">Allow-Credentials</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`// middleware.ts or in the route
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "https://app.example.com";

export async function GET(req: Request) {
  const res = Response.json({ data: "..." });
  res.headers.set("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": CORS_ORIGIN,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  };
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
