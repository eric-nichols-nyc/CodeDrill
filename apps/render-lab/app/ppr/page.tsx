import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// Static part - pre-rendered at build time
async function getStaticData() {
  return {
    title: "Partial Pre-Rendering Demo",
    description: "This content is pre-rendered at build time",
    buildTime: new Date().toISOString(),
  };
}

// Dynamic part - rendered on-demand
async function getDynamicData() {
  // Simulate fetching data from an API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    message: "Hello from the dynamic part!",
    timestamp: new Date().toISOString(),
    randomNumber: Math.floor(Math.random() * 1000),
  };
}

// Dynamic component wrapped in Suspense
async function DynamicContent() {
  const data = await getDynamicData();

  return (
    <div className="space-y-2">
      <div className="rounded-lg border p-3">
        <p className="font-medium text-sm">Dynamic Message:</p>
        <p className="text-muted-foreground">{data.message}</p>
      </div>
      <div className="rounded-lg border p-3">
        <p className="font-medium text-sm">Dynamic Timestamp:</p>
        <p className="text-muted-foreground">{data.timestamp}</p>
      </div>
      <div className="rounded-lg border p-3">
        <p className="font-medium text-sm">Random Number:</p>
        <p className="text-muted-foreground">{data.randomNumber}</p>
      </div>
    </div>
  );
}

// Loading fallback for the dynamic part
function DynamicContentLoading() {
  return (
    <div className="rounded-lg border p-6 text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-2 text-muted-foreground text-sm">
        Loading dynamic content...
      </p>
    </div>
  );
}

const PPRPage = async () => {
  const staticData = await getStaticData();

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
            <CardTitle>Partial Pre-Rendering (PPR)</CardTitle>
            <CardDescription>
              This page uses partial pre-rendering. Static parts are
              pre-rendered at build time, while dynamic parts are rendered
              on-demand.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-orange-500/10 p-4 text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="font-semibold text-orange-600 dark:text-orange-400">
                    Experimental Feature
                  </p>
                  <p className="mt-1 text-orange-700 dark:text-orange-300">
                    PPR is currently experimental in Next.js. Use with caution
                    in production.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How it works:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Static parts are pre-rendered at build time</li>
                <li>Dynamic parts are wrapped in Suspense boundaries</li>
                <li>Pre-rendered HTML is sent immediately</li>
                <li>Dynamic parts stream in as they become ready</li>
                <li>Best of both worlds: fast initial load + fresh content</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold text-sm">
                  Static Content (Pre-rendered):
                </h3>
                <div className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <p className="font-medium text-sm">Title:</p>
                    <p className="text-muted-foreground">{staticData.title}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium text-sm">Description:</p>
                    <p className="text-muted-foreground">
                      {staticData.description}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium text-sm">Build Time:</p>
                    <p className="text-muted-foreground">
                      {staticData.buildTime}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-sm">
                  Dynamic Content (Rendered on-demand):
                </h3>
                <Suspense fallback={<DynamicContentLoading />}>
                  <DynamicContent />
                </Suspense>
              </div>
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 text-sm">
              <p className="font-semibold text-green-600 dark:text-green-400">
                Benefits:
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-green-700 dark:text-green-300">
                <li>Fast initial load: Static parts served immediately</li>
                <li>Fresh content: Dynamic parts update on-demand</li>
                <li>Streaming: Content appears progressively</li>
                <li>Optimal performance: Mix static and dynamic as needed</li>
              </ul>
            </div>

            <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                Use Cases:
              </p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                Perfect for pages with mixed content, such as a blog post with
                static content and dynamic comments, or a product page with
                static details and dynamic pricing/availability.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default PPRPage;
