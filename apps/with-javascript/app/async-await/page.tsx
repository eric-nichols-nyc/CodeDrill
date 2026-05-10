import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const asyncAwaitCode = `// Async Functions
async function fetchData() {
  return "Data";
}

// Await Operator
async function getUser() {
  const response = await fetch("/api/user");
  const user = await response.json();
  return user;
}

// Error Handling
async function safeOperation() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Sequential vs Parallel
async function sequential() {
  const user = await fetchUser(); // Waits
  const posts = await fetchPosts(user.id); // Waits after user
  return { user, posts };
}

async function parallel() {
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
  ]); // Both execute simultaneously
  return { user, posts };
}

// Async Arrow Functions
const asyncArrow = async () => {
  const result = await someAsyncOperation();
  return result;
};

// Async in Classes
class ApiClient {
  async getData() {
    const response = await fetch("/api/data");
    return response.json();
  }
}

// Top-level Await (ES2022)
// const data = await fetchData(); // Works in modules`;

const AsyncAwaitPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Async/Await</CardTitle>
        <CardDescription>
          <code>async</code>/<code>await</code> is syntactic sugar built on top
          of Promises, making asynchronous code look and behave like synchronous
          code.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Key Concepts</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <code>async</code> functions always return a Promise
            </li>
            <li>
              <code>await</code> pauses execution until the Promise settles
            </li>
            <li>
              <code>await</code> can only be used inside <code>async</code>{" "}
              functions
            </li>
            <li>
              Use <code>try/catch</code> for error handling (instead of{" "}
              <code>.catch()</code>)
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Benefits</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Cleaner, more readable code than Promise chains</li>
            <li>Familiar error handling with try/catch</li>
            <li>Easier to debug (reads like synchronous code)</li>
            <li>Less nested than callback-based code</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Best Practices</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              Use <code>Promise.all()</code> for parallel operations
            </li>
            <li>Always handle errors with try/catch</li>
            <li>
              Don't forget <code>await</code> - missing it returns a Promise,
              not the value
            </li>
            <li>Consider using top-level await in modules (ES2022)</li>
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
          <code>{asyncAwaitCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default AsyncAwaitPage;
