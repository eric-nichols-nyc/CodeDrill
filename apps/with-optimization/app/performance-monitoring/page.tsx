import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Activity, BarChart3, Bug, Gauge } from "lucide-react";

const tools = [
  {
    name: "Lighthouse",
    description:
      "Run audits for performance, accessibility, SEO, and best practices. Integrate in CI or use Chrome DevTools.",
    icon: Gauge,
  },
  {
    name: "React DevTools Profiler",
    description:
      "Record commit-by-commit render times and identify components that re-render often or are slow.",
    icon: BarChart3,
  },
  {
    name: "Web Vitals",
    description:
      "Track LCP, FID/INP, CLS, and other metrics. Use next/web-vitals or the web-vitals library for real user monitoring.",
    icon: Activity,
  },
  {
    name: "Chrome DevTools",
    description:
      "Performance tab for flame graphs and main-thread breakdowns, Network for waterfall and throttling.",
    icon: Bug,
  },
];

export default function PerformanceMonitoringPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Performance Monitoring and Profiling</CardTitle>
            </div>
            <CardDescription>
              Tools and practices to measure, profile, and improve your
              application performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Monitoring and profiling help you find bottlenecks, regressions,
              and opportunities to optimize. Use a combination of synthetic
              tools (Lighthouse, DevTools) and real-user metrics (Web Vitals)
              for a complete picture.
            </p>

            <div className="space-y-4">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div className="rounded-lg border p-4" key={tool.name}>
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{tool.name}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {tool.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium">Best practices</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>Set performance budgets and fail builds when exceeded</li>
                <li>
                  Profile in production-like conditions (throttling, low-end
                  device)
                </li>
                <li>Track Core Web Vitals in production with RUM</li>
                <li>Use the React Profiler to find unnecessary re-renders</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
