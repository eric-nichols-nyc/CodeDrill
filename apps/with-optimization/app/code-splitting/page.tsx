import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Code, Layers } from "lucide-react";
import Link from "next/link";

const CodeSplittingPage = () => (
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
          <CardTitle>Code Splitting</CardTitle>
          <CardDescription>
            Automatic code splitting strategies in Next.js
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <h3 className="mb-2 font-semibold">Next.js Code Splitting:</h3>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>Route-based splitting:</strong> Each route gets its own
                bundle
              </li>
              <li>
                <strong>Component-level splitting:</strong> Shared components
                are split automatically
              </li>
              <li>
                <strong>Library splitting:</strong> Third-party libraries are
                separated
              </li>
              <li>
                <strong>Dynamic imports:</strong> Manual splitting for specific
                components
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Automatic Splitting:</h3>
              </div>
              <p className="mb-3 text-muted-foreground text-sm">
                Next.js automatically splits your code at the route level. Each
                page only loads the JavaScript it needs.
              </p>
              <div className="rounded bg-muted p-3">
                <pre className="overflow-x-auto text-xs">
                  {`// app/dashboard/page.tsx
// This page only loads its own code + shared dependencies

// app/settings/page.tsx
// This page loads different code, shared deps are cached`}
                </pre>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Manual Splitting:</h3>
              </div>
              <p className="mb-3 text-muted-foreground text-sm">
                Use dynamic imports for components that aren't needed
                immediately:
              </p>
              <div className="rounded bg-muted p-3">
                <pre className="overflow-x-auto text-xs">
                  {`import dynamic from 'next/dynamic';

// Split heavy components
const Chart = dynamic(() => import('./chart'));
const Modal = dynamic(() => import('./modal'));

// Split by route
const AdminPanel = dynamic(() => import('./admin'));`}
                </pre>
              </div>

              <div className="mt-4 space-y-2 rounded-lg border border-dashed bg-muted/50 p-4">
                <h4 className="font-semibold">
                  Lazy loading with React.lazy and Suspense
                </h4>
                <p className="text-muted-foreground text-sm">
                  Lazy loading allows us to split code at the component level
                  using dynamic imports.
                </p>
                <p className="text-muted-foreground text-sm">
                  <strong>React.lazy()</strong> defers loading a component until
                  it's actually rendered.
                </p>
                <p className="text-muted-foreground text-sm">
                  Since dynamic imports return a Promise, React uses{" "}
                  <strong>Suspense</strong> to handle the loading state.
                </p>
                <p className="text-muted-foreground text-sm">
                  When React encounters the unresolved Promise, it suspends
                  rendering and displays the fallback UI.
                </p>
                <p className="text-muted-foreground text-sm">
                  Once the module loads, React retries the render and replaces
                  the fallback.
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-3 font-semibold">Bundle Structure:</h3>
              <div className="space-y-2 text-sm">
                <div className="rounded bg-muted p-2">
                  <p className="font-medium">framework.js</p>
                  <p className="text-muted-foreground text-xs">
                    Next.js and React core
                  </p>
                </div>
                <div className="rounded bg-muted p-2">
                  <p className="font-medium">main-[hash].js</p>
                  <p className="text-muted-foreground text-xs">
                    Shared application code
                  </p>
                </div>
                <div className="rounded bg-muted p-2">
                  <p className="font-medium">pages/_app-[hash].js</p>
                  <p className="text-muted-foreground text-xs">
                    App component and layout
                  </p>
                </div>
                <div className="rounded bg-muted p-2">
                  <p className="font-medium">pages/[route]-[hash].js</p>
                  <p className="text-muted-foreground text-xs">
                    Route-specific code
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
            <p className="font-semibold text-blue-600 dark:text-blue-400">
              Optimization Tips:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-blue-700 dark:text-blue-300">
              <li>Keep shared dependencies small</li>
              <li>Use dynamic imports for large libraries</li>
              <li>Monitor bundle sizes with bundle analyzer</li>
              <li>Consider route-based splitting for large apps</li>
              <li>Leverage Next.js automatic optimizations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
);

export default CodeSplittingPage;
