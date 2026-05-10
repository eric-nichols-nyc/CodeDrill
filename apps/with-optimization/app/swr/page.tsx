"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Clock, RefreshCw, Zap } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SWRPage = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/users", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0, // Disable auto-refresh by default
  });

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
            <CardTitle>SWR (Stale-While-Revalidate)</CardTitle>
            <CardDescription>
              Efficient data fetching with automatic caching, revalidation, and
              error handling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How SWR works:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>
                  <strong>Stale-while-revalidate:</strong> Returns cached data
                  immediately, then fetches fresh data in the background
                </li>
                <li>
                  <strong>Automatic revalidation:</strong> Revalidates on focus,
                  reconnect, and interval
                </li>
                <li>
                  <strong>Deduplication:</strong> Multiple components using the
                  same key share one request
                </li>
                <li>
                  <strong>Error handling:</strong> Built-in error retry and
                  fallback
                </li>
                <li>
                  <strong>Optimistic updates:</strong> Update UI immediately,
                  rollback on error
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium text-sm">Status:</span>
                <div className="flex items-center gap-2">
                  {isLoading && (
                    <span className="text-muted-foreground text-sm">
                      Loading...
                    </span>
                  )}
                  {error && (
                    <span className="text-red-500 text-sm">
                      Error loading data
                    </span>
                  )}
                  {data && (
                    <span className="text-green-500 text-sm">Data loaded</span>
                  )}
                </div>
              </div>

              {data && (
                <>
                  <div className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-sm">Last Updated:</p>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {data.timestamp}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-semibold">Users List:</h3>
                    <div className="space-y-2">
                      {data.users.map(
                        (user: {
                          id: number;
                          name: string;
                          email: string;
                          role: string;
                        }) => (
                          <div
                            className="flex items-center justify-between rounded border p-3"
                            key={user.id}
                          >
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-muted-foreground text-sm">
                                {user.email}
                              </p>
                            </div>
                            <span className="rounded bg-primary/10 px-2 py-1 text-xs">
                              {user.role}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => mutate()}
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Revalidate
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <p className="font-semibold text-blue-600 dark:text-blue-400">
                  Benefits:
                </p>
              </div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-blue-700 dark:text-blue-300">
                <li>Instant data display from cache</li>
                <li>Automatic background updates</li>
                <li>Reduced server load through deduplication</li>
                <li>Better user experience with optimistic updates</li>
                <li>Built-in error handling and retry logic</li>
              </ul>
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 text-sm">
              <p className="font-semibold text-green-600 dark:text-green-400">
                Use Cases:
              </p>
              <p className="mt-1 text-green-700 dark:text-green-300">
                Perfect for dashboard data, user profiles, real-time feeds, and
                any data that needs to stay fresh but can tolerate showing stale
                data initially. SWR is especially useful when multiple
                components need the same data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SWRPage;
