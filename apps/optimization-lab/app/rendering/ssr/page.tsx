import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Server } from "lucide-react";
import Link from "next/link";

// This page is rendered on the server for each request
async function getServerData() {
  // Simulate fetching data from an API or database
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    message: "This page is rendered on the server for each request!",
    renderTime: new Date().toISOString(),
    type: "Server-Side Rendering (SSR)",
    // In a real app, this would be user-specific or real-time data
    userAgent: "Server-rendered content",
  };
}

// No export const revalidate = means this is SSR
const SSRPage = async () => {
  const data = await getServerData();

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/">
          <Button className="mb-4" variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Server-Side Rendering (SSR)</CardTitle>
            <CardDescription>
              This page is rendered on the server for each request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How SSR Works:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Page is rendered on the server for each request</li>
                <li>Fresh data is fetched on every request</li>
                <li>HTML is generated dynamically</li>
                <li>Sent to client with fully rendered content</li>
                <li>Best for personalized or real-time content</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm">Type:</p>
                <p className="text-muted-foreground">{data.type}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm">Render Time:</p>
                <p className="text-muted-foreground">{data.renderTime}</p>
                <p className="mt-1 text-muted-foreground text-xs">
                  (This updates on every page refresh)
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 text-sm">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="font-semibold text-green-600 dark:text-green-400">
                  Benefits:
                </p>
              </div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-green-700 dark:text-green-300">
                <li>Always fresh, up-to-date content</li>
                <li>Personalized content per user</li>
                <li>SEO-friendly (pre-rendered HTML)</li>
                <li>Access to server-side APIs/databases</li>
                <li>No stale data issues</li>
              </ul>
            </div>

            <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                Trade-offs:
              </p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                Slower than SSG (server computation per request), higher server
                load, requires server for every request.
              </p>
            </div>

            <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                Use Cases:
              </p>
              <p className="mt-1 text-blue-700 dark:text-blue-300">
                User dashboards, personalized content, real-time data, pages
                that require authentication, content that changes frequently.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SSRPage;
