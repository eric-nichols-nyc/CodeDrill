import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Layers } from "lucide-react";
import Image from "next/image";

const HomePage = () => (
  <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background p-8">
    <div className="flex w-full max-w-4xl flex-col gap-8 lg:flex-row lg:items-center">
      <div className="flex-1">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">SOLID Principles</CardTitle>
            <CardDescription>Object-oriented design principles</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-center text-muted-foreground text-sm">
              Demonstrate SOLID principles and best practices in React and
              Next.js applications. Use the sidebar to navigate between
              principles.
            </p>
            <div className="flex justify-center">
              <ModeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1">
        <Card>
          <CardContent className="pt-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                alt="SOLID Principles Overview"
                className="object-contain"
                fill
                priority
                src="/assets/solid-principles.png"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
);

export default HomePage;
