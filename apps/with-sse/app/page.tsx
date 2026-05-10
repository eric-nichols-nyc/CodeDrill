import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Radio } from "lucide-react";
import Link from "next/link";

const HomePage = () => (
  <main className="flex min-h-screen items-center justify-center bg-background p-8">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Radio className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Server-Sent Events</CardTitle>
        <CardDescription>Real-time updates with SSE</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-center text-muted-foreground text-sm">
          Demonstrate Server-Sent Events (SSE) for real-time server-to-client
          communication.
        </p>
        <div className="flex justify-center">
          <ModeToggle />
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/time">
            <Button className="w-full">Time Display</Button>
          </Link>
          <Link href="/loading">
            <Button className="w-full" variant="outline">
              Loading Status
            </Button>
          </Link>
          <Link href="/real-time-notifications">
            <Button className="w-full" variant="outline">
              Real-Time Notifications
            </Button>
          </Link>
          <Link href="/test-dashboard">
            <Button className="w-full" variant="outline">
              Test Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  </main>
);

export default HomePage;
