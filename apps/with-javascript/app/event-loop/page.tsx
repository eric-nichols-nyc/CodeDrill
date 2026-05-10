import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const eventLoopCode = `// Understanding the Event Loop

console.log("1"); // Synchronous

setTimeout(() => {
  console.log("2"); // Macro task (Callback Queue)
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // Micro task (Job Queue)
});

console.log("4"); // Synchronous

// Output: 1, 4, 3, 2

// Why? Execution order:
// 1. All synchronous code runs first
// 2. Micro tasks (Promises, queueMicrotask) run next
// 3. Macro tasks (setTimeout, setInterval) run after

// Macro Tasks vs Micro Tasks
setTimeout(() => console.log("Macro 1"), 0);
setTimeout(() => console.log("Macro 2"), 0);

Promise.resolve().then(() => console.log("Micro 1"));
Promise.resolve().then(() => console.log("Micro 2"));

// Output: Micro 1, Micro 2, Macro 1, Macro 2

// Call Stack, Callback Queue, Job Queue
function first() {
  console.log("First");
  second();
}

function second() {
  console.log("Second");
  setTimeout(() => console.log("Callback"), 0);
  Promise.resolve().then(() => console.log("Promise"));
  third();
}

function third() {
  console.log("Third");
}

first();
// Output: First, Second, Third, Promise, Callback`;

const EventLoopPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Event Loop</CardTitle>
        <CardDescription>
          The Event Loop is what allows JavaScript to perform non-blocking
          operations by offloading operations to the system kernel when
          possible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">How It Works</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>Call Stack:</strong> Where synchronous code executes
            </li>
            <li>
              <strong>Web APIs:</strong> Handle async operations (setTimeout,
              fetch, etc.)
            </li>
            <li>
              <strong>Callback Queue:</strong> Holds macro tasks (setTimeout,
              setInterval)
            </li>
            <li>
              <strong>Job Queue:</strong> Holds micro tasks (Promises,
              queueMicrotask)
            </li>
            <li>
              <strong>Event Loop:</strong> Moves tasks from queues to call stack
              when stack is empty
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Execution Order</h3>
          <ol className="list-inside list-decimal space-y-1 text-muted-foreground text-sm">
            <li>All synchronous code executes first</li>
            <li>All micro tasks (Promises) execute next</li>
            <li>One macro task (setTimeout, etc.) executes</li>
            <li>All micro tasks execute again</li>
            <li>Repeat until queues are empty</li>
          </ol>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Key Concepts</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>JavaScript is single-threaded but uses async callbacks</li>
            <li>Micro tasks have higher priority than macro tasks</li>
            <li>
              <code>setTimeout(fn, 0)</code> doesn't execute immediately - it's
              queued
            </li>
            <li>
              The event loop continuously checks if the call stack is empty
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Code Example</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code>{eventLoopCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default EventLoopPage;
