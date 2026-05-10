import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, CheckCircle, Zap } from "lucide-react";
import Link from "next/link";

const PerformanceTipsPage = () => {
  const tips = [
    {
      category: "Rendering",
      items: [
        "Use Static Generation (SSG) when possible",
        "Implement ISR for frequently updated content",
        "Use React Server Components for server-side rendering",
        "Minimize client-side JavaScript",
      ],
    },
    {
      category: "Data Fetching",
      items: [
        "Use SWR or React Query for client-side data",
        "Implement proper caching strategies",
        "Deduplicate API requests",
        "Use streaming for large data sets",
      ],
    },
    {
      category: "Assets",
      items: [
        "Optimize images with Next.js Image component",
        "Use WebP/AVIF formats",
        "Implement font optimization",
        "Lazy load non-critical assets",
      ],
    },
    {
      category: "Code",
      items: [
        "Use dynamic imports for large components",
        "Remove unused dependencies",
        "Tree-shake unused code",
        "Minimize bundle size",
      ],
    },
    {
      category: "Caching",
      items: [
        "Leverage Next.js caching strategies",
        "Use appropriate cache headers",
        "Implement stale-while-revalidate patterns",
        "Cache static assets aggressively",
      ],
    },
  ];

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
            <CardTitle>Performance Tips</CardTitle>
            <CardDescription>
              Best practices and optimization strategies for Next.js
              applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {tips.map((tip) => (
              <div className="rounded-lg border p-4" key={tip.category}>
                <div className="mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{tip.category}</h3>
                </div>
                <ul className="space-y-2">
                  {tip.items.map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-muted-foreground text-sm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                Measurement:
              </p>
              <p className="mt-2 text-blue-700 dark:text-blue-300">
                Use tools like Lighthouse, Web Vitals, and bundle analyzer to
                measure and monitor your application's performance. Set
                performance budgets and track them in your CI/CD pipeline.
              </p>
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 text-sm">
              <p className="font-semibold text-green-600 dark:text-green-400">
                Core Web Vitals:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-green-700 dark:text-green-300">
                <li>
                  <strong>LCP (Largest Contentful Paint):</strong> &lt; 2.5s
                </li>
                <li>
                  <strong>FID (First Input Delay):</strong> &lt; 100ms
                </li>
                <li>
                  <strong>CLS (Cumulative Layout Shift):</strong> &lt; 0.1
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default PerformanceTipsPage;
