import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { FlaskConical, MousePointer, Timer, Wifi } from "lucide-react";
import Link from "next/link";

const demos = [
  {
    title: "Custom Hooks",
    description: "Test useCounter, useToggle, useFetch, useLocalStorage",
    href: "/hooks",
    icon: FlaskConical,
  },
  {
    title: "Component Testing",
    description: "Render, query, and interact with components",
    href: "/components",
    icon: MousePointer,
  },
  {
    title: "API Mocking",
    description: "Mock endpoints with MSW",
    href: "/api-mocking",
    icon: Wifi,
  },
  {
    title: "Async Patterns",
    description: "waitFor, findBy, loading states, timers",
    href: "/async",
    icon: Timer,
  },
];

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <FlaskConical className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 font-bold text-4xl">Testing Lab</h1>
        <p className="text-muted-foreground">
          Interactive demos for testing React apps with Vitest & Playwright
        </p>
      </div>

      <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
        {demos.map((demo) => (
          <Link href={demo.href} key={demo.href}>
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <demo.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{demo.title}</CardTitle>
                <CardDescription>{demo.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Run Tests</CardTitle>
          <CardDescription>
            Commands to run from the testing-lab directory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 font-mono text-sm">
            <p className="text-muted-foreground"># Unit tests with Vitest</p>
            <p>pnpm test</p>
            <p className="mt-2 text-muted-foreground">
              # E2E tests with Playwright
            </p>
            <p>pnpm test:e2e</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
