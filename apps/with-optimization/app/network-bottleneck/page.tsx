"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Network, Timer } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

type Item = { id: number; name: string; description: string };

const fetchItem = async (id: number): Promise<Item> => {
  const res = await fetch(`/api/network-bottleneck/items/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
};

/** Bad: waterfall — each request waits for the previous. Total ~3s for 5 items. */
async function fetchSequential(ids: number[]): Promise<Item[]> {
  const items: Item[] = [];
  for (const id of ids) {
    const item = await fetchItem(id);
    items.push(item);
  }
  return items;
}

/** Good: parallel — all requests in flight. Total ~600ms. */
async function fetchParallel(ids: number[]): Promise<Item[]> {
  const results = await Promise.all(ids.map((id) => fetchItem(id)));
  return results;
}

const NetworkBottleneckPage = () => {
  const [items, setItems] = useState<Item[] | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [mode, setMode] = useState<"sequential" | "parallel" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (parallel: boolean) => {
    setLoading(true);
    setError(null);
    setItems(null);
    setElapsedMs(null);
    setMode(parallel ? "parallel" : "sequential");

    const start = performance.now();
    try {
      const listRes = await fetch("/api/network-bottleneck/items");
      if (!listRes.ok) {
        throw new Error("Failed to fetch list");
      }
      const { ids } = await listRes.json();

      let result: Item[];
      if (parallel) {
        result = await fetchParallel(ids);
      } else {
        result = await fetchSequential(ids);
      }
      setItems(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setElapsedMs(Math.round(performance.now() - start));
      setLoading(false);
    }
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
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Network className="h-5 w-5" />
              </div>
              <CardTitle>API / Network Bottleneck</CardTitle>
            </div>
            <CardDescription>
              Waterfall (sequential) vs parallel requests. Open DevTools →
              Network to see the difference and use this for
              debugging/discussion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={loading}
                onClick={() => run(false)}
                variant="outline"
              >
                Run sequential (waterfall)
              </Button>
              <Button
                disabled={loading}
                onClick={() => run(true)}
                variant="outline"
              >
                Run parallel
              </Button>
            </div>

            {loading ? (
              <p className="text-muted-foreground text-sm">
                Loading… (watch the Network tab)
              </p>
            ) : null}

            {error ? <p className="text-destructive text-sm">{error}</p> : null}

            {elapsedMs !== null && !error ? (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {mode === "sequential" ? "Sequential" : "Parallel"}:
                </span>
                <span className="text-muted-foreground">
                  {elapsedMs} ms total
                </span>
              </div>
            ) : null}

            {items ? (
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Items</h3>
                <ul className="space-y-1 text-sm">
                  {items.map((item) => (
                    <li key={item.id}>
                      <strong>{item.name}</strong> — {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="space-y-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <h3 className="font-semibold text-amber-700 dark:text-amber-400">
                What to look for (debug / interview)
              </h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>
                  <strong>Network tab:</strong> Sequential = 5 requests one
                  after another (waterfall). Parallel = 5 requests at once.
                </li>
                <li>
                  <strong>Bottleneck:</strong> Each /items/[id] waits ~600ms.
                  Sequential: 5 × 600ms ≈ 3s. Parallel: ~600ms total.
                </li>
                <li>
                  <strong>Fix:</strong> Use{" "}
                  <code className="rounded bg-muted px-1">Promise.all</code> or
                  a backend endpoint that returns all items in one call.
                </li>
                <li>
                  <strong>Real-world:</strong> Same pattern with “list IDs then
                  fetch each” (N+1), or dependent API calls that could be
                  batched/parallelized.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default NetworkBottleneckPage;
