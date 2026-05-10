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

type Data = {
  message: string;
  timestamp: string;
  randomNumber: number;
};

async function getData(): Promise<Data> {
  // Simulate fetching data from an API or database
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    message: "Hello from Server-Side Rendering!",
    timestamp: new Date().toISOString(),
    randomNumber: Math.floor(Math.random() * 1000),
  };
}

const SSRPage = async () => {
  const data = await getData();
  const serverRenderTime = new Date().toISOString();

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
              This page uses server-side rendering. The data is fetched on the
              server for each request, and the complete HTML is sent to the
              client.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How it works:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Request arrives at the server</li>
                <li>Server fetches data (API, database, etc.)</li>
                <li>Server renders React components to HTML</li>
                <li>Complete HTML is sent to the client</li>
                <li>Client hydrates the React components</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium text-sm">Server Render Time:</span>
                <span className="text-muted-foreground text-sm">
                  {serverRenderTime}
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
                <li>SEO-friendly: Search engines receive full HTML</li>
                <li>Fast initial load: Content is ready immediately</li>
                <li>Fresh data: Each request gets the latest data</li>
                <li>Personalized: Can use request headers, cookies, etc.</li>
              </ul>
            </div>

            <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                Trade-offs:
              </p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                SSR requires server processing for each request, which can
                increase server load and response time compared to static
                generation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SSRPage;
