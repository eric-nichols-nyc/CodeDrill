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
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

// Dynamic import with loading state
const HeavyComponent = dynamic(() => import("./heavy-component"), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="ml-2 text-muted-foreground">Loading component...</span>
    </div>
  ),
  ssr: false, // Disable SSR for this component
});

const DynamicImportPage = () => {
  const [showComponent, setShowComponent] = useState(false);

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
            <CardTitle>Dynamic Imports</CardTitle>
            <CardDescription>
              Code splitting with dynamic imports for faster initial page load
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How Dynamic Imports Work:</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Components are loaded only when needed (lazy loading)</li>
                <li>
                  Reduces initial bundle size and improves Time to Interactive
                  (TTI)
                </li>
                <li>Can disable SSR for client-only components</li>
                <li>Supports loading states and error boundaries</li>
                <li>Automatic code splitting by Next.js</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-3 font-semibold">Example:</h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  Click the button below to dynamically load a heavy component.
                  Notice how it only loads when needed, reducing the initial
                  bundle size.
                </p>
                <Button
                  onClick={() => setShowComponent(!showComponent)}
                  variant="outline"
                >
                  {showComponent ? "Hide" : "Load"} Heavy Component
                </Button>
              </div>

              {showComponent && (
                <div className="rounded-lg border p-4">
                  <HeavyComponent />
                </div>
              )}

              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Implementation:</h3>
                </div>
                <div className="rounded bg-muted p-3">
                  <pre className="overflow-x-auto text-xs">
                    {`import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('./heavy-component'),
  {
    loading: () => <Loading />,
    ssr: false, // Optional: disable SSR
  }
);`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                When to Use:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-blue-700 dark:text-blue-300">
                <li>Large components that aren't immediately visible</li>
                <li>Components with heavy dependencies</li>
                <li>Client-only components (charts, maps, etc.)</li>
                <li>Conditionally rendered components</li>
                <li>
                  Third-party libraries that are only used in specific routes
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default DynamicImportPage;
