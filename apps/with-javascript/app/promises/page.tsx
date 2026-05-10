import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const promisesCode = `// Creating Promises
const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("Operation succeeded!");
  } else {
    reject("Operation failed!");
  }
});

// Consuming Promises
promise
  .then((value) => {
    console.log(value); // "Operation succeeded!"
    return "Next value";
  })
  .then((value) => {
    console.log(value); // "Next value"
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Always runs");
  });

// Promise States
// - Pending: Initial state
// - Fulfilled: Operation completed successfully
// - Rejected: Operation failed

// Static Methods
Promise.resolve("Immediate value");
Promise.reject("Immediate error");

// Promise.all - waits for all to complete
Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(values => console.log(values)); // [1, 2, 3]

// Promise.allSettled - waits for all (including failures)
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject("Error"),
  Promise.resolve(3)
]).then(results => console.log(results));

// Promise.race - first to settle wins
Promise.race([
  new Promise(resolve => setTimeout(() => resolve("Fast"), 100)),
  new Promise(resolve => setTimeout(() => resolve("Slow"), 500))
]).then(value => console.log(value)); // "Fast"

// Promise.any - first to fulfill
Promise.any([
  Promise.reject("Error 1"),
  Promise.resolve("Success"),
  Promise.reject("Error 2")
]).then(value => console.log(value)); // "Success"`;

const PromisesPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Promises</CardTitle>
        <CardDescription>
          A Promise is an object representing the eventual completion or failure
          of an asynchronous operation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Promise States</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>Pending:</strong> Initial state, neither fulfilled nor
              rejected
            </li>
            <li>
              <strong>Fulfilled:</strong> Operation completed successfully
            </li>
            <li>
              <strong>Rejected:</strong> Operation failed
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Promise Methods</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <code>.then()</code>: Handles fulfilled state
            </li>
            <li>
              <code>.catch()</code>: Handles rejected state
            </li>
            <li>
              <code>.finally()</code>: Always executes regardless of outcome
            </li>
            <li>
              <code>Promise.all()</code>: Waits for all promises to fulfill
            </li>
            <li>
              <code>Promise.race()</code>: Returns first settled promise
            </li>
            <li>
              <code>Promise.allSettled()</code>: Waits for all promises to
              settle
            </li>
            <li>
              <code>Promise.any()</code>: Returns first fulfilled promise
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Benefits</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Avoids callback hell (pyramid of doom)</li>
            <li>
              Better error handling with <code>.catch()</code>
            </li>
            <li>Chaining for sequential async operations</li>
            <li>Composable and testable</li>
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
          <code>{promisesCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default PromisesPage;
