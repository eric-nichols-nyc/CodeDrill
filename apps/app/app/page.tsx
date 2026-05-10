import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Rocket } from "lucide-react";

const HomePage = () => (
  <main className="flex min-h-screen items-center justify-center bg-background p-8">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Rocket className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Client App</CardTitle>
        <CardDescription>
          A minimal Next.js app with no environment dependencies
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-center text-muted-foreground text-sm">
          This app uses the shared design system but doesn&apos;t require any
          environment variables to run.
        </p>
        <Button className="w-full">Get Started</Button>
      </CardContent>
    </Card>
  </main>
);

export default HomePage;
