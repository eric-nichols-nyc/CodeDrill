import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Code2 } from "lucide-react";

const HomePage = () => (
  <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background p-8">
    <div className="flex w-full max-w-4xl flex-col gap-8 lg:flex-row lg:items-center">
      <div className="flex-1">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">TypeScript Examples</CardTitle>
            <CardDescription>
              Learn TypeScript from basic to advanced concepts
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-center text-muted-foreground text-sm">
              Explore interactive TypeScript examples covering basic types,
              unions, generics, tuples, utility types, conditional types, and
              more. Use the sidebar to navigate between concepts.
            </p>
            <div className="flex justify-center">
              <ModeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Topics Covered</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-sm">Basic</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Basic Types</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-sm">Intermediate</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Unions</li>
                <li>Intersections</li>
                <li>Generics</li>
                <li>Tuples</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-sm">Advanced</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Utility Types</li>
                <li>Conditional Types</li>
                <li>Mapped Types</li>
                <li>Template Literal Types</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
);

export default HomePage;
