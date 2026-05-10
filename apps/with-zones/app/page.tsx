import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Globe } from "lucide-react";

const HomePage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">With Zones</h1>
        <p className="mt-2 text-muted-foreground">
          Next.js multi-zones app — compose multiple Next.js applications
          together
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Globe className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Zones</CardTitle>
          </div>
          <CardDescription>
            This app is set up for Next.js multi-zones. You can add a
            basePath and proxy to other zone apps, or use this as a host for
            composed applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Run with: <code className="rounded bg-muted px-1.5 py-0.5">pnpm dev --filter with-zones</code>
          </p>
        </CardContent>
      </Card>
    </div>
  </main>
);

export default HomePage;
