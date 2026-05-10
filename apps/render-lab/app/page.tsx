import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Boxes, Code, Layers, RefreshCw, Server, Zap } from "lucide-react";
import Link from "next/link";

const strategies = [
  {
    name: "Client-Side Rendering (CSR)",
    description: "Content rendered in the browser after JavaScript loads",
    href: "/csr",
    icon: Code,
    color: "text-blue-500",
  },
  {
    name: "Server-Side Rendering (SSR)",
    description: "Content rendered on the server for each request",
    href: "/ssr",
    icon: Server,
    color: "text-green-500",
  },
  {
    name: "Static Site Generation (SSG)",
    description: "Content pre-rendered at build time",
    href: "/ssg",
    icon: Zap,
    color: "text-yellow-500",
  },
  {
    name: "Incremental Static Regeneration (ISR)",
    description: "Pre-rendered pages regenerated in the background",
    href: "/isr",
    icon: RefreshCw,
    color: "text-purple-500",
  },
  {
    name: "React Server Components (RSC)",
    description: "Components that run on the server and don't ship JS to the client",
    href: "/rsc",
    icon: Boxes,
    color: "text-cyan-500",
  },
  {
    name: "Partial Pre-Rendering (PPR)",
    description: "Selectively pre-render parts of a page (Experimental)",
    href: "/ppr",
    icon: Layers,
    color: "text-orange-500",
  },
];

const HomePage = () => (
  <div className="p-8">
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">Render Lab</h1>
        <p className="mt-2 text-muted-foreground">
          Explore different Next.js rendering strategies
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
          <CardTitle>About Render Lab</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This application demonstrates the different rendering strategies
            available in Next.js. Each example page shows how data is fetched
            and rendered, along with timestamps to help you understand when and
            where the rendering occurs.
          </p>
          <p className="mt-4 text-muted-foreground text-sm">
            View the source code to see the implementation details of each
            strategy.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default HomePage;
