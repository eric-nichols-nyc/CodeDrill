import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AsyncPage() {
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

        <h1 className="mb-2 font-bold text-3xl">Async Testing Patterns</h1>
        <p className="mb-8 text-muted-foreground">
          Handling asynchronous operations in tests
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>waitFor</CardTitle>
              <CardDescription>Wait for a condition to be true</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                <pre>{`await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});

// Or with timeout
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
}, { timeout: 5000 });`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>findBy Queries</CardTitle>
              <CardDescription>
                Async queries that wait for elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                <pre>{`// findBy* = getBy* + waitFor
const button = await screen.findByRole("button");

// With timeout
const element = await screen.findByText("Loaded", {}, {
  timeout: 3000
});`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fake Timers</CardTitle>
              <CardDescription>
                Control time for debounce/throttle testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                <pre>{`beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("debounces input", async () => {
  // Trigger debounced function
  await userEvent.type(input, "test");

  // Fast-forward time
  vi.advanceTimersByTime(500);

  expect(handler).toHaveBeenCalled();
});`}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
