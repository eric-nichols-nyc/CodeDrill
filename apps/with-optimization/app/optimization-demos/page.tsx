"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { ArrowLeft, Database, Keyboard, Layers, Zap } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useRef, useState, useTransition } from "react";

const DEMO_ITEMS = Array.from({ length: 8000 }, (_, i) => `Item ${i + 1}`);

function burnMs(ms: number) {
  const start = performance.now();
  while (performance.now() - start < ms) {
    // block
  }
}

/** Expensive filter — simulates slow list filter on every keystroke. */
function filterItems(items: string[], query: string): string[] {
  burnMs(6);
  if (!query.trim()) {
    return items;
  }
  const q = query.toLowerCase();
  return items.filter((s) => s.toLowerCase().includes(q));
}

// ----- Slow input: Before (sync) vs After (useDeferredValue) -----
function SlowInputSection() {
  const [query, setQuery] = useState("");
  const [useDeferred, setUseDeferred] = useState(false);

  const deferredQuery = useDeferredValue(query);
  const valueForFilter = useDeferred ? deferredQuery : query;

  const filtered = filterItems(DEMO_ITEMS, valueForFilter);

  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
            <Keyboard className="h-5 w-5" />
          </div>
          <CardTitle>Slow input (filter on type)</CardTitle>
        </div>
        <CardDescription>
          Type quickly. Before: input can lag because filtering blocks. After:
          useDeferredValue keeps the input snappy and defers the list update.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="shrink-0" htmlFor="filter-query">
            Filter:
          </Label>
          <Input
            className="max-w-xs"
            id="filter-query"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to filter 8000 items…"
            value={query}
          />
          <Button
            onClick={() => setUseDeferred((v) => !v)}
            size="sm"
            variant={useDeferred ? "default" : "outline"}
          >
            {useDeferred ? "After (useDeferredValue)" : "Before (sync)"}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Showing {filtered.length} items. Toggle to compare typing feel.
        </p>
      </CardContent>
    </Card>
  );
}

// ----- Slow tab: Before (blocking) vs After (useTransition) -----
const HEAVY_TAB_ITEMS = Array.from({ length: 300 }, (_, i) => ({
  id: `heavy-${i + 1}`,
  label: `Heavy list item ${i + 1}`,
}));

function HeavyTabContent() {
  burnMs(80);
  return (
    <ul className="max-h-48 list-inside space-y-0.5 overflow-y-auto text-sm">
      {HEAVY_TAB_ITEMS.map((item) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  );
}

function SlowTabSection() {
  const [tab, setTab] = useState<"light" | "heavy">("light");
  const [isPending, startTransition] = useTransition();
  const [useTransitionFlag, setUseTransitionFlag] = useState(false);

  const setTabWithTransition = (next: "light" | "heavy") => {
    if (useTransitionFlag) {
      startTransition(() => setTab(next));
    } else {
      setTab(next);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Layers className="h-5 w-5" />
          </div>
          <CardTitle>Slow tab (useTransition)</CardTitle>
        </div>
        <CardDescription>
          Switch to “Heavy” tab. Before: UI freezes until the heavy tab renders.
          After: tab switches immediately; content streams in without blocking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setTabWithTransition("light")}
            size="sm"
            variant={tab === "light" ? "default" : "outline"}
          >
            Light
          </Button>
          <Button
            onClick={() => setTabWithTransition("heavy")}
            size="sm"
            variant={tab === "heavy" ? "default" : "outline"}
          >
            Heavy
          </Button>
          <Button
            onClick={() => setUseTransitionFlag((v) => !v)}
            size="sm"
            variant={useTransitionFlag ? "default" : "outline"}
          >
            {useTransitionFlag ? "After (useTransition)" : "Before (sync)"}
          </Button>
        </div>
        {isPending ? (
          <p className="text-muted-foreground text-sm">Loading tab…</p>
        ) : null}
        {tab === "light" && (
          <p className="text-muted-foreground text-sm">Light tab content.</p>
        )}
        {tab === "heavy" && !isPending && <HeavyTabContent />}
      </CardContent>
    </Card>
  );
}

// ----- Caching: fetch every time vs cache -----
const slowFakeFetch = (): Promise<{ message: string; ts: number }> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: "Loaded (took 1.5s)",
        ts: Date.now(),
      });
    }, 1500);
  });

function CachingSection() {
  const [data, setData] = useState<{ message: string; ts: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [useCache, setUseCache] = useState(false);
  const cacheRef = useRef<{ message: string; ts: number } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      if (useCache && cacheRef.current) {
        setData(cacheRef.current);
      } else {
        const result = await slowFakeFetch();
        cacheRef.current = result;
        setData(result);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    cacheRef.current = null;
    setData(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Database className="h-5 w-5" />
          </div>
          <CardTitle>Caching</CardTitle>
        </div>
        <CardDescription>
          Before: every "Load" waits 1.5s. After: first load is slow; next loads
          use cache (instant). Clear cache to reset.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button disabled={loading} onClick={load} size="sm" variant="outline">
            {loading ? "Loading…" : "Load data"}
          </Button>
          <Button
            onClick={() => setUseCache((v) => !v)}
            size="sm"
            variant={useCache ? "default" : "outline"}
          >
            {useCache ? "After (cached)" : "Before (no cache)"}
          </Button>
          <Button onClick={clearCache} size="sm" variant="ghost">
            Clear cache
          </Button>
        </div>
        {data ? (
          <p className="text-muted-foreground text-sm">
            {data.message} — ts: {data.ts}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

// ----- Page -----
export default function OptimizationDemosPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button size="sm" variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-2xl">Optimization demos</h1>
            <p className="text-muted-foreground text-sm">
              Slow input, slow tab, and caching — before/after on one page.
            </p>
          </div>
        </div>

        <SlowInputSection />
        <SlowTabSection />
        <CachingSection />
      </div>
    </main>
  );
}
