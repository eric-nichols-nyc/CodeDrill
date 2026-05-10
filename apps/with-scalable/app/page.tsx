import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const HomePage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">Scalable App</h1>
        <p className="mt-2 text-muted-foreground">
          A Next.js app for exploring scalable architecture and patterns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            This application is set up for building and demonstrating scalable
            patterns. Add routes and demos from the sidebar as you grow the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Run{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              pnpm dev
            </code>{" "}
            from the{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              apps/with-scalable
            </code>{" "}
            directory, or{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              pnpm --filter with-scalable dev
            </code>{" "}
            from the monorepo root. The app runs on port 3020.
          </p>
        </CardContent>
      </Card>
    </div>
  </main>
);

export default HomePage;
