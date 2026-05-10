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
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

// This function generates static params at build time
// In a real app, you'd fetch this from an API or database
export async function generateStaticParams() {
  // Generate static pages for IDs 1-5 at build time
  return Array.from({ length: 5 }, (_, i) => ({
    id: String(i + 1),
  }));
}

// This function runs at build time for each static param and can be revalidated
async function getData(id: string) {
  // Simulate fetching data from an API or database
  await new Promise((resolve) => setTimeout(resolve, 100));

  // In a real app, you'd fetch based on the ID
  return {
    id,
    title: `Product ${id}`,
    description: `This is product ${id} with ISR enabled`,
    price: Math.floor(Math.random() * 1000) + 100,
    timestamp: new Date().toISOString(),
    buildTime: new Date().toISOString(),
  };
}

const ISRProductPage = async ({ params }: PageProps) => {
  "use cache";
  cacheLife({ revalidate: 10 }); // Revalidate every 10 seconds (ISR-style)

  const { id } = await params;
  const data = await getData(id);

  // Validate that the ID is within our generated params range
  const idNum = Number.parseInt(id, 10);
  if (Number.isNaN(idNum) || idNum < 1 || idNum > 5) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/isr">
          <Button className="mb-4" variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ISR Examples
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>ISR with generateStaticParams</CardTitle>
            <CardDescription>
              This dynamic route uses both generateStaticParams and ISR. The
              paths are pre-rendered at build time and can be regenerated in the
              background.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How it works:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>
                  generateStaticParams() runs at build time to create paths for
                  IDs 1-5
                </li>
                <li>Each path is pre-rendered at build time (like SSG)</li>
                <li>Pre-rendered HTML is served immediately</li>
                <li>
                  After revalidate time (10s), next request triggers
                  regeneration
                </li>
                <li>
                  Background regeneration happens without blocking the user
                </li>
                <li>
                  New paths (e.g., ID 6) can be generated on-demand and then
                  cached
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium text-sm">Product ID:</span>
                <span className="text-muted-foreground text-sm">{data.id}</span>
              </div>

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
                  <p className="font-medium text-sm">Title:</p>
                  <p className="text-muted-foreground">{data.title}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium text-sm">Description:</p>
                  <p className="text-muted-foreground">{data.description}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium text-sm">Price:</p>
                  <p className="text-muted-foreground">${data.price}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium text-sm">Data Timestamp:</p>
                  <p className="text-muted-foreground">{data.timestamp}</p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    (This will update after revalidation period)
                  </p>
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

            <div className="rounded-lg bg-purple-500/10 p-4 text-sm">
              <p className="font-semibold text-purple-600 dark:text-purple-400">
                generateStaticParams Benefits:
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-purple-700 dark:text-purple-300">
                <li>
                  Pre-renders specific paths at build time for instant delivery
                </li>
                <li>Reduces server load by pre-generating popular pages</li>
                <li>Works seamlessly with ISR for background updates</li>
                <li>
                  On-demand generation for paths not in generateStaticParams
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 text-sm">
              <p className="font-semibold text-green-600 dark:text-green-400">
                Use Cases:
              </p>
              <p className="mt-1 text-green-700 dark:text-green-300">
                Perfect for e-commerce product pages, blog posts, or any content
                with dynamic routes that need to be pre-rendered for popular
                items while still allowing on-demand generation for new content.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="mb-2 font-semibold text-sm">Try different IDs:</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((productId) => (
                  <Link href={`/isr/${productId}`} key={productId}>
                    <Button
                      size="sm"
                      variant={id === String(productId) ? "default" : "outline"}
                    >
                      Product {productId}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ISRProductPage;
