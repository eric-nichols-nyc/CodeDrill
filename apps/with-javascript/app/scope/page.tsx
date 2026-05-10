import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const scopeCode = `// Global Scope
var globalVar = "I'm global";

function example() {
  // Function Scope
  var functionVar = "I'm in function scope";
  let blockVar = "I'm block scoped";

  if (true) {
    // Block Scope (let/const)
    let blockScoped = "I'm only accessible here";
    const anotherBlock = "Same here";
    var functionScoped = "I'm hoisted to function scope";
  }

  // console.log(blockScoped); // ReferenceError
  console.log(functionScoped); // Works - var is function scoped
}

// Lexical Scope Example
function outer() {
  const outerVar = "outer";

  function inner() {
    const innerVar = "inner";
    console.log(outerVar); // Can access outer scope
  }

  // console.log(innerVar); // Error - can't access inner
  inner();
}`;

const ScopePage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Scope</CardTitle>
        <CardDescription>
          Scope determines the accessibility of variables, functions, and
          objects in different parts of your code.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Types of Scope</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>Global Scope:</strong> Variables declared outside any
              function or block
            </li>
            <li>
              <strong>Function Scope:</strong> Variables declared with{" "}
              <code>var</code> are function-scoped
            </li>
            <li>
              <strong>Block Scope:</strong> Variables declared with{" "}
              <code>let</code> and <code>const</code> are block-scoped
            </li>
            <li>
              <strong>Lexical Scope:</strong> Inner functions have access to
              outer function variables
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Key Concepts</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <code>var</code> is function-scoped, not block-scoped
            </li>
            <li>
              <code>let</code> and <code>const</code> are block-scoped
              (introduced in ES6)
            </li>
            <li>
              JavaScript uses lexical scoping - inner functions can access outer
              scope
            </li>
            <li>Scope chain determines which variables are accessible</li>
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
          <code>{scopeCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default ScopePage;
