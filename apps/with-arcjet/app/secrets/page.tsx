import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Key } from "lucide-react";

export default function SecretsPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">Secrets</h1>
          <p className="mt-2 text-muted-foreground">
            Managing API keys and sensitive config
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Key className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Why secrets matter</CardTitle>
            </div>
            <CardDescription>
              API keys, database URLs, and signing secrets must never be committed to the repo or exposed to the client. They should live in environment variables (or a secrets manager) and only be read on the server.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Use <code className="rounded bg-muted px-1 py-0.5 text-sm">.env.local</code> (gitignored) for local dev; in production use your host’s env or a vault (e.g. Vercel env, AWS Secrets Manager). Only variables prefixed with <code className="rounded bg-muted px-1 py-0.5 text-sm">NEXT_PUBLIC_</code> are exposed to the browser — never use that prefix for secrets.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next.js example</CardTitle>
            <CardDescription>
              Read secrets from <code className="rounded bg-muted px-1 py-0.5 text-sm">process.env</code> in server code only. Validate presence at startup or when first used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`// Server-only: API route, server component, or lib
const apiKey = process.env.ARCJET_KEY;
if (!apiKey) {
  throw new Error("ARCJET_KEY is required");
}

// Use in server-side logic only — never pass to client
const arcjet = createArcjet({ key: apiKey });

// .env.local (never commit):
// ARCJET_KEY=ajkey_...
// DATABASE_URL=postgresql://...
// SIGNING_SECRET=...`}
            </pre>
            <p className="mt-4 text-muted-foreground text-sm">
              In server components and route handlers, <code className="rounded bg-muted px-1 py-0.5 text-sm">process.env</code> is only available on the server; Next.js does not bundle env vars without <code className="rounded bg-muted px-1 py-0.5 text-sm">NEXT_PUBLIC_</code> into client JS.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
