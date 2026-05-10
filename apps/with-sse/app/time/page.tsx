import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { TimeDisplay } from "@/components/time-display";

const TimePage = () => (
  <main className="flex min-h-screen items-center justify-center bg-background p-8">
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Current Time</CardTitle>
        <CardDescription>Real-time clock display</CardDescription>
      </CardHeader>
      <CardContent className="py-12">
        <TimeDisplay />
      </CardContent>
    </Card>
  </main>
);

export default TimePage;
