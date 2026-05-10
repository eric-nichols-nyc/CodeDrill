import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { cacheLife } from "next/cache";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

// This function runs at build time and can be revalidated
async function getData() {
  // Simulate fetching data from an API or database
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    message: "Hello from Incremental Static Regeneration!",
    timestamp: new Date().toISOString(),
    randomNumber: Math.floor(Math.random() * 1000),
    buildTime: new Date().toISOString(),
  };
}

const ISRPage = async () => {
  "use cache";
  cacheLife({ revalidate: 10 }); // Revalidate every 10 seconds (ISR-style)

  const data = await getData();

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
            <CardTitle>Incremental Static Regeneration (ISR)</CardTitle>
            <CardDescription>
              This page is statically generated at build time, but can be
              regenerated in the background when content becomes stale.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How it works:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Page is pre-rendered at build time (like SSG)</li>
                <li>Pre-rendered HTML is served immediately</li>
                <li>
                  After revalidate time (10s), next request triggers
                  regeneration
                </li>
                <li>
                  Background regeneration happens without blocking the user
                </li>
                <li>Updated page is served to subsequent requests</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium text-sm">Revalidation Time:</span>
                <span className="text-muted-foreground text-sm">
                  10 seconds
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium text-sm">Last Build Time:</span>
                <span className="text-muted-foreground text-sm">
                  {data.buildTime}
                </span>
              </div>

              <div className="space-y-2">
                <div className="rounded-lg border p-3">
                  <p className="font-medium text-sm">Message:</p>
                  <p className="text-muted-foreground">{data.message}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium text-sm">Data Timestamp:</p>
                  <p className="text-muted-foreground">{data.timestamp}</p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    (This will update after revalidation period)
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium text-sm">Random Number:</p>
                  <p className="text-muted-foreground">{data.randomNumber}</p>
                </div>
              </div>

              <div className="rounded-lg bg-blue-500/10 p-3 text-sm">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <p className="font-semibold text-blue-600 dark:text-blue-400">
                    Try refreshing this page after 10 seconds to see
                    regeneration
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 text-sm">
              <p className="font-semibold text-green-600 dark:text-green-400">
                Benefits:
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-green-700 dark:text-green-300">
                <li>Fast performance: Pre-rendered HTML served instantly</li>
                <li>Fresh content: Pages update automatically in background</li>
                <li>No full rebuilds: Only stale pages are regenerated</li>
                <li>Scalable: Can serve millions of pages efficiently</li>
              </ul>
            </div>

            <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                Use Cases:
              </p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                Perfect for content that changes occasionally, such as product
                listings, blog posts with comments, or news articles. You get
                the speed of static with the freshness of dynamic content.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="mb-2 font-semibold text-sm">
                See ISR with generateStaticParams:
              </p>
              <p className="mb-3 text-muted-foreground text-sm">
                Check out the dynamic route example that demonstrates how ISR
                works with generateStaticParams for pre-rendering specific paths
                at build time.
              </p>
              <Link href="/isr/1">
                <Button className="w-full" variant="outline">
                  View Dynamic Route Example (Product 1)
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ISRPage;
