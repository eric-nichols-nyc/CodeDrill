"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Cpu } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const ITEM_COUNT = 5000;
const ITEMS = Array.from({ length: ITEM_COUNT }, (_, i) => i);

/** Intentionally expensive: filter + sort on every call. */
function expensiveFilterAndSort(
  items: number[],
  minValue: number,
  label: string
): number[] {
  console.log(`[useMemo demo] ${label} — computing (minValue=${minValue})`);
  const start = performance.now();
  const filtered = items.filter((n) => n >= minValue);
  const sorted = [...filtered].sort((a, b) => a - b);
  while (performance.now() - start < 8) {
    // Burn ~8ms so the difference is noticeable
  }
  return sorted;
}

const UseMemoDemoPage = () => {
  const [minValue, setMinValue] = useState(0);
  const [renderCount, setRenderCount] = useState(0);

  // Before: runs on every render (including when only renderCount changes)
  const resultBefore = expensiveFilterAndSort(
    ITEMS,
    minValue,
    "Before (no useMemo)"
  );

  // After: runs only when minValue changes
  const resultAfter = useMemo(
    () => expensiveFilterAndSort(ITEMS, minValue, "After (useMemo)"),
    [minValue]
  );

  const triggerReRender = () => {
    setRenderCount((c) => c + 1);
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
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cpu className="h-5 w-5" />
              </div>
              <CardTitle>useMemo: Before vs After</CardTitle>
            </div>
            <CardDescription>
              Trigger re-renders with the button below. Without useMemo, the
              expensive computation runs every time. With useMemo, it runs only
              when dependencies change.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={triggerReRender} size="sm" variant="outline">
                Re-render (count: {renderCount})
              </Button>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Min value:</span>
                <input
                  className="w-32"
                  max={100}
                  min={0}
                  onChange={(e) => setMinValue(Number(e.target.value))}
                  type="range"
                  value={minValue}
                />
                <span>{minValue}</span>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
                <h3 className="mb-1 font-semibold text-amber-700 dark:text-amber-400">
                  Before (no useMemo)
                </h3>
                <p className="mb-2 text-muted-foreground text-sm">
                  Runs on every render. Click “Re-render” and watch React
                  DevTools or add a console.log in the function.
                </p>
                <p className="font-mono text-sm">
                  Result length: {resultBefore.length}
                </p>
              </div>
              <div className="rounded-lg border border-green-500/40 bg-green-500/5 p-4">
                <h3 className="mb-1 font-semibold text-green-700 dark:text-green-400">
                  After (with useMemo)
                </h3>
                <p className="mb-2 text-muted-foreground text-sm">
                  Runs only when{" "}
                  <code className="rounded bg-muted px-1">minValue</code>{" "}
                  changes.
                </p>
                <p className="font-mono text-sm">
                  Result length: {resultAfter.length}
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="mb-2 font-semibold">What to look for</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>
                  <strong>Before:</strong> Every “Re-render” click runs the
                  heavy filter/sort again even though the result is the same.
                </li>
                <li>
                  <strong>After:</strong> useMemo returns the cached result
                  until <code className="rounded bg-muted px-1">minValue</code>{" "}
                  changes.
                </li>
                <li>
                  Use useMemo for expensive derived values; avoid it for cheap
                  work or when dependencies change every render.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default UseMemoDemoPage;
