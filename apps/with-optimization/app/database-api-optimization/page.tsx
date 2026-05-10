import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Database, Server, Zap } from "lucide-react";

const sections = [
  {
    title: "Database optimization",
    icon: Database,
    items: [
      "Add indexes on frequently queried and filtered columns",
      "Use connection pooling to reuse connections and reduce latency",
      "Select only the columns you need; avoid SELECT *",
      "Use pagination or cursor-based pagination for large result sets",
      "Consider read replicas for read-heavy workloads",
    ],
  },
  {
    title: "API optimization",
    icon: Server,
    items: [
      "Cache responses (in-memory, Redis, or CDN) with appropriate TTLs",
      "Batch or combine requests to reduce round trips",
      "Use HTTP compression (gzip/brotli) for response bodies",
      "Implement rate limiting and backpressure to protect services",
      "Prefer streaming or chunked responses for large payloads",
    ],
  },
];

export default function DatabaseApiOptimizationPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Database and API Optimization</CardTitle>
            </div>
            <CardDescription>
              Strategies to reduce latency, improve throughput, and scale data
              and API layers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Slow databases and APIs are common bottlenecks. Optimizing
              queries, connections, caching, and request patterns keeps your app
              fast as data and traffic grow.
            </p>

            <div className="space-y-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div className="rounded-lg border p-4" key={section.title}>
                    <div className="mb-3 flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{section.title}</h3>
                    </div>
                    <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <p className="font-medium">Next.js integration</p>
              </div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  Use Server Actions or Route Handlers for API logic; keep DB
                  access on the server
                </li>
                <li>
                  Leverage fetch caching and revalidation (e.g. next.revalidate)
                </li>
                <li>
                  Use SWR or React Query on the client for deduping and
                  cache-first patterns
                </li>
                <li>Advanced: Implement data prefetching</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
