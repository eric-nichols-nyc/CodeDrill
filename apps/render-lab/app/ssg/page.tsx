import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// This function runs at build time
async function getData() {
  // Simulate fetching data from an API or database
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    message: "Hello from Static Site Generation!",
    timestamp: new Date().toISOString(),
    randomNumber: Math.floor(Math.random() * 1000),
    buildTime: new Date().toISOString(),
  };
}

// This page is statically generated at build time
const SSGPage = async () => {
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
            <CardTitle>Static Site Generation (SSG)</CardTitle>
            <CardDescription>
              This page is statically generated at build time. The HTML is
              pre-rendered and can be served from a CDN.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How it works:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>During build time, Next.js calls getData()</li>
                <li>Server renders React components to HTML</li>
                <li>HTML is saved as static files</li>
                <li>Files can be served from CDN</li>
                <li>No server processing needed at request time</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium text-sm">Build Time:</span>
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
                    (This was generated at build time)
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium text-sm">Random Number:</p>
                  <p className="text-muted-foreground">{data.randomNumber}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 text-sm">
              <p className="font-semibold text-green-600 dark:text-green-400">
                Benefits:
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-green-700 dark:text-green-300">
                <li>Fastest performance: Pre-rendered HTML served instantly</li>
                <li>Excellent SEO: Full HTML available to search engines</li>
                <li>
                  Scalable: Can be served from CDN with minimal server load
                </li>
                <li>Cost-effective: No server processing per request</li>
              </ul>
            </div>

            <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                Use Cases:
              </p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                Best for content that doesn&apos;t change frequently, such as
                blog posts, documentation, marketing pages, or product catalogs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SSGPage;
