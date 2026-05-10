import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Database, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { AuthHeader } from "@/components/auth-header";

const HomePage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-4xl">TanStack Query + Tailwind</h1>
          <p className="mt-2 text-muted-foreground">
            Boilerplate with @tanstack/react-query, Tailwind, and better-auth
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AuthHeader />
          <ModeToggle />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/dashboard">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Dashboard</CardTitle>
              </div>
              <CardDescription>
                Protected page — view your account (sign in required)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/users">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-amber-500">
                  <Database className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Users (useQuery)</CardTitle>
              </div>
              <CardDescription>
                Fetch and display users with TanStack Query — caching, refetch,
                and loading states
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Example
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  </main>
);

export default HomePage;
