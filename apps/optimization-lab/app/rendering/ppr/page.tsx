import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Layers, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// Static part - pre-rendered at build time
async function getStaticContent() {
  return {
    title: "Partial Pre-Rendering (PPR)",
    description: "This static content is pre-rendered at build time",
    buildTime: new Date().toISOString(),
  };
}

// Dynamic part - rendered on demand
async function getDynamicContent() {
  // Simulate a slow API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    message: "This dynamic content is rendered on demand!",
    renderTime: new Date().toISOString(),
  };
}

// Dynamic component wrapped in Suspense
async function DynamicSection() {
  const data = await getDynamicContent();
  return (
    <div className="rounded-lg border p-4">
      <p className="font-medium text-sm">Dynamic Content:</p>
      <p className="text-muted-foreground">{data.message}</p>
      <p className="mt-2 text-muted-foreground text-sm">
        Rendered at: {data.renderTime}
      </p>
    </div>
  );
}

const PPRPage = async () => {
  const staticData = await getStaticContent();

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
            <CardTitle>{staticData.title}</CardTitle>
            <CardDescription>
              This page uses PPR - static content is pre-rendered, dynamic
              content loads on demand
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How PPR Works:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Static parts are pre-rendered at build time</li>
                <li>Dynamic parts are wrapped in Suspense boundaries</li>
                <li>Static shell is served immediately</li>
                <li>Dynamic content streams in as it's ready</li>
                <li>Best of both worlds: speed + freshness</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <p className="font-medium text-sm">
                  Static Content (Pre-rendered):
                </p>
                <p className="text-muted-foreground">
                  {staticData.description}
                </p>
                <p className="mt-2 text-muted-foreground text-sm">
                  Build time: {staticData.buildTime}
                </p>
              </div>

              <Suspense
                fallback={
                  <div className="flex items-center justify-center rounded-lg border p-8">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
                    <span className="text-muted-foreground">
                      Loading dynamic content...
                    </span>
                  </div>
                }
              >
                <DynamicSection />
              </Suspense>
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 text-sm">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="font-semibold text-green-600 dark:text-green-400">
                  Benefits:
                </p>
              </div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-green-700 dark:text-green-300">
                <li>Fast initial load (static shell)</li>
                <li>Fresh dynamic content when needed</li>
                <li>Progressive enhancement</li>
                <li>Better UX than full SSR</li>
                <li>Scalable architecture</li>
              </ul>
            </div>

            <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                Use Cases:
              </p>
              <p className="mt-1 text-blue-700 dark:text-blue-300">
                Pages with mix of static and dynamic content, product pages with
                static info + dynamic pricing, blog posts with static content +
                dynamic comments, dashboards with static layout + dynamic data.
              </p>
            </div>

            <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                Note:
              </p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                Full PPR requires{" "}
                <code className="rounded bg-yellow-600/20 px-1">
                  cacheComponents: true
                </code>{" "}
                in next.config.ts, but this conflicts with ISR. This demo uses
                Suspense boundaries to demonstrate the PPR concept - static
                content loads immediately while dynamic content streams in.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default PPRPage;
