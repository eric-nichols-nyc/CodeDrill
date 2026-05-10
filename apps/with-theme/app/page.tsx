import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Palette } from "lucide-react";

const HomePage = () => (
  <main className="flex min-h-screen items-center justify-center bg-background p-8">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Palette className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Theme Demo</CardTitle>
        <CardDescription>
          Toggle between light, dark, and system themes
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-center text-muted-foreground text-sm">
          This app demonstrates the theme provider and mode toggle from the
          shared design system.
        </p>
        <div className="flex justify-center">
          <ModeToggle />
        </div>
        <Button className="w-full">Get Started</Button>
      </CardContent>
    </Card>
  </main>
);

export default HomePage;
