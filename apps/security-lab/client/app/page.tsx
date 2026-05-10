import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Security Lab</CardTitle>
          <CardDescription>
            A sandbox for security testing and experimentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground text-sm">
            This is a bare-bones Next.js 16 app ready for security experiments.
          </p>
          <div className="flex justify-center">
            <Link href="/secure-form">
              <Button>Get Started</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
