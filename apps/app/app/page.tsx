import { UserButton } from "@neondatabase/neon-auth-ui";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Database } from "lucide-react";
import Link from "next/link";

const HomePage = () => (
  <div>
    <header className="flex h-16 items-center justify-end gap-4 p-4">
      <ModeToggle />
      <UserButton size="icon" />
    </header>

    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Neon Auth</CardTitle>
          <CardDescription>
            Authentication demo with Neon database.{" "}
            <Link
              className="font-medium text-foreground underline-offset-4 hover:underline"
              href="/dashboard"
            >
              Go to dashboard
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-muted-foreground text-sm">
            Use Neon Auth (hosted UI), then open the dashboard (session + user
            JSON).
          </p>
          <div className="flex justify-center">
            <ModeToggle />
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
);

export default HomePage;
