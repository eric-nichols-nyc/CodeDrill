"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthHeader } from "@/components/auth-header";
import { useSession } from "@/lib/auth-client";

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!(isPending || session?.user)) {
      router.push("/sign-in");
    }
  }, [isPending, session?.user, router]);

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const { user } = session;

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/">
            <Button size="sm" variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <AuthHeader />
        </div>

        <Card>
          <CardHeader>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <CardTitle>Dashboard</CardTitle>
            </div>
            <CardDescription>
              Welcome back, {user.name ?? user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Account</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Email:</dt>
                  <dd>{user.email}</dd>
                </div>
                {user.name && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Name:</dt>
                    <dd>{user.name}</dd>
                  </div>
                )}
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">ID:</dt>
                  <dd className="font-mono text-xs">{user.id}</dd>
                </div>
              </dl>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/users">View Users Example</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default DashboardPage;
