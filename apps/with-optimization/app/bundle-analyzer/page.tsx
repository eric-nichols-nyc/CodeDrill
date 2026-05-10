import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { FileCode, Package, Scissors, Terminal } from "lucide-react";

export default function TreeShakingBundleAnalysisPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Tree Shaking and Bundle Analysis</CardTitle>
            </div>
            <CardDescription>
              Remove unused code and analyze your Next.js bundle size to find
              optimization opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2">
                <Scissors className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Tree shaking</h3>
              </div>
              <p className="mb-2 text-muted-foreground text-sm">
                Tree shaking is a build step that drops code you never import or
                use. Bundlers (e.g. webpack, Turbopack) use static analysis to
                mark unused exports as dead code and exclude them from the final
                bundle.
              </p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Use named imports so only used exports are included</li>
                <li>
                  Prefer libraries that publish ES modules and support
                  sideEffects
                </li>
                <li>
                  Avoid importing entire libraries (e.g. import _ from
                  "lodash"); use modular imports
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">Bundle analysis</h3>
              <p className="text-muted-foreground text-sm">
                @next/bundle-analyzer helps you visualize the size of your
                JavaScript bundles. It creates interactive treemap
                visualizations that show which modules take up the most space so
                you can prioritize tree shaking, code splitting, or lighter
                alternatives.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">How to use</h3>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="rounded bg-muted p-2">
                    <p className="text-muted-foreground"># Run the analyzer</p>
                    <p className="mt-1">pnpm analyze</p>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    This builds your app and opens interactive bundle size
                    reports in your browser.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Configuration</h3>
                </div>
                <div className="rounded bg-muted p-3">
                  <pre className="overflow-x-auto text-xs">
                    {`// next.config.ts
import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // your config
};

export default withBundleAnalyzer(nextConfig);`}
                  </pre>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">What to look for</h3>
                </div>
                <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                  <li>
                    <strong>Large dependencies:</strong> Heavy libraries to
                    replace or code-split
                  </li>
                  <li>
                    <strong>Duplicate code:</strong> Modules that appear in
                    multiple chunks
                  </li>
                  <li>
                    <strong>Unused code:</strong> Imports that could be removed
                    or improved for tree shaking
                  </li>
                  <li>
                    <strong>Candidates for dynamic imports:</strong> Big modules
                    only needed in specific routes or on interaction
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                Optimization tips
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-blue-700 dark:text-blue-300">
                <li>Use dynamic imports for large components</li>
                <li>Remove unused dependencies</li>
                <li>
                  Choose tree-shaking-friendly libraries and import only what
                  you use
                </li>
                <li>Split vendor chunks appropriately</li>
                <li>Monitor bundle size in CI/CD</li>
              </ul>
            </div>

            <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                Best practices
              </p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                Run bundle analysis regularly, especially before major releases.
                Set bundle size budgets and enforce them in CI. Use the results
                to decide where to apply tree shaking, code splitting, or
                alternative dependencies.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
