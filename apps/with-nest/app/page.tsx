import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Hexagon } from "lucide-react";
import Link from "next/link";

const topics = [
  { href: "/overview", title: "Overview", blurb: "How Nest fits together and relates to Next.js" },
  { href: "/controllers", title: "Controllers", blurb: "HTTP routes and request handling" },
  { href: "/providers", title: "Providers", blurb: "Injectable services and dependency injection" },
  { href: "/modules", title: "Modules", blurb: "Bundling features with @Module" },
  { href: "/middleware", title: "Middleware", blurb: "Cross-cutting logic before route handlers" },
  { href: "/pipes", title: "Pipes", blurb: "Validation and transformation of inputs" },
  { href: "/guards", title: "Guards", blurb: "AuthZ and route access control" },
  { href: "/interceptors", title: "Interceptors", blurb: "Wrapping handlers for logging, mapping, and more" },
] as const;

const HomePage = () => (
  <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-background p-8">
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Hexagon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">NestJS concepts</CardTitle>
          <CardDescription>
            Reference pages for core Nest ideas. Pair with the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-foreground text-xs">
              nest-api
            </code>{" "}
            workspace app for runnable code.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-2">
          <ModeToggle />
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map(({ href, title, blurb }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{blurb}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </main>
);

export default HomePage;
