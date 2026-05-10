import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Code,
  Cpu,
  Image,
  Layers,
  Network,
  Package,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

const strategies = [
  {
    name: "Network Bottleneck",
    description: "Waterfall vs parallel API requests — debug and discuss",
    href: "/network-bottleneck",
    icon: Network,
    color: "text-amber-500",
  },
  {
    name: "useMemo",
    description:
      "Before/after: expensive computation on every render vs memoized",
    href: "/use-memo-demo",
    icon: Cpu,
    color: "text-cyan-500",
  },
  {
    name: "Optimization demos",
    description:
      "Slow input (useDeferredValue), slow tab (useTransition), caching",
    href: "/optimization-demos",
    icon: Sparkles,
    color: "text-violet-500",
  },
  {
    name: "SWR (Data Fetching)",
    description: "Stale-while-revalidate data fetching for optimal performance",
    href: "/swr",
    icon: TrendingUp,
    color: "text-blue-500",
  },
  {
    name: "Bundle Analyzer",
    description: "Analyze and optimize your bundle size",
    href: "/bundle-analyzer",
    icon: Package,
    color: "text-green-500",
  },
  {
    name: "Dynamic Imports",
    description: "Code splitting with dynamic imports for faster initial load",
    href: "/dynamic-import",
    icon: Code,
    color: "text-purple-500",
  },
  {
    name: "Image Optimization",
    description: "Next.js Image component for optimized image delivery",
    href: "/image-optimization",
    icon: Image,
    color: "text-yellow-500",
  },
  {
    name: "Code Splitting",
    description: "Automatic code splitting and lazy loading strategies",
    href: "/code-splitting",
    icon: Layers,
    color: "text-orange-500",
  },
  {
    name: "Performance Tips",
    description: "Additional optimization techniques and best practices",
    href: "/performance-tips",
    icon: Zap,
    color: "text-pink-500",
  },
];

const HomePage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">Next.js Optimization Lab</h1>
        <p className="mt-2 text-muted-foreground">
          Explore optimization strategies to improve your Next.js application
          performance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy) => {
          const Icon = strategy.icon;
          return (
            <Link href={strategy.href} key={strategy.href}>
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ${strategy.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  </div>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    View Example
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About Optimization Lab</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This application demonstrates various optimization strategies
            available in Next.js. Each example page shows how to implement
            different techniques to improve performance, reduce bundle size, and
            enhance user experience.
          </p>
          <p className="mt-4 text-muted-foreground text-sm">
            View the source code to see the implementation details of each
            optimization strategy.
          </p>
        </CardContent>
      </Card>
    </div>
  </main>
);

export default HomePage;
