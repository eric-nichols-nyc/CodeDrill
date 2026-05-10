import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import { Shield, Zap } from "lucide-react";

const HomePage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">with-arcjet</h1>
        <p className="mt-2 text-muted-foreground">
          Next.js app with Arcjet rate limiting and security
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Protected by Arcjet</CardTitle>
            </div>
            <CardDescription>
              All routes are protected with a token-bucket rate limit. Get a key
              at app.arcjet.com and set ARCJET_KEY in .env to enable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <a href="/api/hello">Try protected API</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Run locally</CardTitle>
            </div>
            <CardDescription>
              From the monorepo root:{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                pnpm --filter with-arcjet dev
              </code>
              . App runs on port 3022.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Without ARCJET_KEY, rate limiting runs in dry-run mode (requests
              are allowed; set a key to enforce limits).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
);

export default HomePage;
