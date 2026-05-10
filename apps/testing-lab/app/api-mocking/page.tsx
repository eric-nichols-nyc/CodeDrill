import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ApiMockingPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
          href="/"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to demos
        </Link>

        <h1 className="mb-2 font-bold text-3xl">API Mocking with MSW</h1>
        <p className="mb-8 text-muted-foreground">
          Mock Service Worker for network-level mocking
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Handler Setup</CardTitle>
              <CardDescription>
                Define mock handlers in mocks/handlers.ts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                <pre>{`import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
    ]);
  }),
];`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Override for Specific Tests</CardTitle>
              <CardDescription>
                Use server.use() to override handlers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                <pre>{`it("handles errors", async () => {
  server.use(
    http.get("/api/users", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  // Test error handling...
});`}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
