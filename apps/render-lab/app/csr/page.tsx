"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Data = {
  message: string;
  timestamp: string;
  randomNumber: number;
};

const CSRPage = () => {
  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientRenderTime] = useState(new Date().toISOString());

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const res = await fetch("/api/data");
      const result = await res.json();
      setData(result);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    const res = await fetch("/api/data");
    const result = await res.json();
    setData(result);
    setIsLoading(false);
  };

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
              This page uses client-side rendering. The data is fetched in the
              browser after the page loads.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How it works:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Page HTML is sent to the browser</li>
                <li>JavaScript bundle loads and executes</li>
                <li>React components render on the client</li>
                <li>Data is fetched via API call in useEffect</li>
                <li>Content updates after data arrives</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium text-sm">Client Render Time:</span>
                <span className="text-muted-foreground text-sm">
                  {clientRenderTime}
                </span>
              </div>

              {isLoading ? (
                <div className="rounded-lg border p-6 text-center">
                  <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground text-sm">
                    Loading data...
                  </p>
                </div>
              ) : data ? (
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
              ) : null}

              <Button
                className="w-full"
                onClick={handleRefresh}
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>

            <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                Note:
              </p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                With CSR, the initial HTML is minimal. Search engines may have
                difficulty indexing the content, and users see a loading state
                before content appears.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CSRPage;
