import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const closuresCode = `// Basic Closure
function outerFunction() {
  const outerVariable = "I'm from outer!";

  function innerFunction() {
    console.log(outerVariable); // Access outer scope
  }

  return innerFunction;
}

const myFunction = outerFunction();
myFunction(); // "I'm from outer!"

// Practical Example: Counter
function createCounter() {
  let count = 0;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

counter1.increment(); // 1
counter1.increment(); // 2
counter2.increment(); // 1 (independent closure)

// Module Pattern
const myModule = (function() {
  let privateVar = 0;

  return {
    getPrivateVar: () => privateVar,
    setPrivateVar: (val) => { privateVar = val; }
  };
})();`;

const ClosuresPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Closures</CardTitle>
        <CardDescription>
          A closure is a function that has access to variables in its outer
          (enclosing) lexical scope, even after the outer function has returned.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">How Closures Work</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Inner functions have access to outer function variables</li>
            <li>Variables persist even after the outer function completes</li>
            <li>Each closure has its own "private" copy of variables</li>
            <li>Enables data privacy and function factories</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Common Use Cases</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>Data Privacy:</strong> Encapsulate private variables
            </li>
            <li>
              <strong>Function Factories:</strong> Create specialized functions
            </li>
            <li>
              <strong>Event Handlers:</strong> Maintain state in callbacks
            </li>
            <li>
              <strong>Module Pattern:</strong> Create namespaces and prevent
              global pollution
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
          <code>{closuresCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default ClosuresPage;
