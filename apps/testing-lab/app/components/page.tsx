import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ComponentsPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
          href="/"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to demos
        </Link>

        <h1 className="mb-2 font-bold text-3xl">Component Testing</h1>
        <p className="mb-8 text-muted-foreground">
          Patterns for testing React components
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Testing Patterns</CardTitle>
            <CardDescription>
              Common patterns for component testing with Testing Library
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 font-mono text-sm">
              <p className="text-muted-foreground">// Render and query</p>
              <p>render(&lt;Component /&gt;);</p>
              <p>screen.getByRole(&apos;button&apos;);</p>
              <br />
              <p className="text-muted-foreground">// User interactions</p>
              <p>await userEvent.click(button);</p>
              <p>await userEvent.type(input, &apos;text&apos;);</p>
              <br />
              <p className="text-muted-foreground">// Assertions</p>
              <p>expect(element).toBeInTheDocument();</p>
              <p>expect(element).toHaveTextContent(&apos;text&apos;);</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
