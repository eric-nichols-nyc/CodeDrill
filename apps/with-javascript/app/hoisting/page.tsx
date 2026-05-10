import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const hoistingCode = `// Variable Hoisting
console.log(x); // undefined (not ReferenceError)
var x = 5;

// Function Hoisting
sayHello(); // Works - function is hoisted

function sayHello() {
  console.log("Hello!");
}

// Let and Const Hoisting (Temporal Dead Zone)
// console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// Function Expression (not hoisted)
// sayGoodbye(); // TypeError: sayGoodbye is not a function
var sayGoodbye = function() {
  console.log("Goodbye!");
};

// Class Hoisting
// const obj = new MyClass(); // ReferenceError
class MyClass {
  constructor() {
    this.name = "MyClass";
  }
}`;

const HoistingPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Hoisting</CardTitle>
        <CardDescription>
          Hoisting is JavaScript's default behavior of moving declarations to
          the top of their scope before code execution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">What Gets Hoisted</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>var declarations:</strong> Hoisted and initialized with{" "}
              <code>undefined</code>
            </li>
            <li>
              <strong>function declarations:</strong> Fully hoisted (can be
              called before declaration)
            </li>
            <li>
              <strong>let/const:</strong> Hoisted but not initialized (Temporal
              Dead Zone)
            </li>
            <li>
              <strong>class declarations:</strong> Not hoisted (must be declared
              before use)
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Key Points</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Only declarations are hoisted, not initializations</li>
            <li>
              Function expressions are not hoisted (only the variable
              declaration is)
            </li>
            <li>Arrow functions follow the same rules as variables</li>
            <li>
              Temporal Dead Zone prevents accessing <code>let</code>/
              <code>const</code> before declaration
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
          <code>{hoistingCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default HoistingPage;
