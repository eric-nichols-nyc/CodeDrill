import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

// This page is statically generated at build time
// No data fetching = SSG
async function getStaticData() {
  // This runs at build time
  return {
    message: "This page was pre-rendered at build time!",
    buildTime: new Date().toISOString(),
    type: "Static Site Generation (SSG)",
  };
}

const SSGPage = async () => {
  const data = await getStaticData();

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
              This page is pre-rendered at build time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How SSG Works:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Page is generated at build time</li>
                <li>HTML is pre-rendered and cached</li>
                <li>Served instantly from CDN</li>
                <li>No server computation per request</li>
                <li>Best for content that doesn't change frequently</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm">Type:</p>
                <p className="text-muted-foreground">{data.type}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm">Build Time:</p>
                <p className="text-muted-foreground">{data.buildTime}</p>
                <p className="mt-1 text-muted-foreground text-xs">
                  (This timestamp is from when the app was built)
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="font-semibold text-green-600 dark:text-green-400">
                  Benefits:
                </p>
              </div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-green-700 dark:text-green-300">
                <li>Fastest possible load times</li>
                <li>Excellent SEO (pre-rendered HTML)</li>
                <li>CDN cacheable</li>
                <li>No server load</li>
                <li>Works offline (with service worker)</li>
              </ul>
            </div>

            <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                Use Cases:
              </p>
              <p className="mt-1 text-blue-700 dark:text-blue-300">
                Blog posts, documentation, marketing pages, product catalogs
                (when data doesn't change frequently), landing pages.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SSGPage;
