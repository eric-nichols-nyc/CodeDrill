import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { LoadingDisplay } from "@/components/loading-display";

const LoadingPage = () => (
  <main className="flex min-h-screen items-center justify-center bg-background p-8">
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Loading Status</CardTitle>
        <CardDescription>Real-time loading progress stream</CardDescription>
      </CardHeader>
      <CardContent className="py-12">
        <LoadingDisplay />
      </CardContent>
    </Card>
  </main>
);

export default LoadingPage;
