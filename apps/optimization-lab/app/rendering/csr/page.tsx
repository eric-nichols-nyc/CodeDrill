"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Code, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const CSRPage = () => {
  const [data, setData] = useState<{
    message: string;
    timestamp: string;
    loaded: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data on the client
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData({
        message: "This content was rendered on the client!",
        timestamp: new Date().toISOString(),
        loaded: true,
      });
      setLoading(false);
    };

    fetchData();
  }, []);

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
            <CardTitle>Client-Side Rendering (CSR)</CardTitle>
            <CardDescription>
              This page is rendered in the browser after JavaScript loads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How CSR Works:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Initial HTML is minimal (just shell)</li>
                <li>JavaScript loads and executes in browser</li>
                <li>React renders components on client</li>
                <li>Data is fetched via API calls</li>
                <li>Content appears after JavaScript runs</li>
              </ul>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center rounded-lg border p-8">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              ) : (
                data && (
                  <>
                    <div className="rounded-lg border p-3">
                      <p className="font-medium text-sm">Message:</p>
                      <p className="text-muted-foreground">{data.message}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="font-medium text-sm">Load Time:</p>
                      <p className="text-muted-foreground">{data.timestamp}</p>
                      <p className="mt-1 text-muted-foreground text-xs">
                        (This updates when you refresh the page)
                      </p>
                    </div>
                  </>
                )
              )}
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 text-sm">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="font-semibold text-green-600 dark:text-green-400">
                  Benefits:
                </p>
              </div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-green-700 dark:text-green-300">
                <li>Rich interactivity and dynamic behavior</li>
                <li>No server load (static hosting possible)</li>
                <li>Fast navigation (client-side routing)</li>
                <li>Real-time updates without page refresh</li>
                <li>Works well for SPAs</li>
              </ul>
            </div>

            <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                Trade-offs:
              </p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                Slower initial load (JavaScript must download and execute), SEO
                challenges (content not in initial HTML), requires JavaScript
                enabled.
              </p>
            </div>

            <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                Use Cases:
              </p>
              <p className="mt-1 text-blue-700 dark:text-blue-300">
                Dashboards, admin panels, interactive applications, apps that
                don't need SEO, highly dynamic user interfaces.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CSRPage;
