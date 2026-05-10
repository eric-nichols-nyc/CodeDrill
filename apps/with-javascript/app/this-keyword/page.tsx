import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const thisKeywordCode = `// Global Context
console.log(this); // Window (browser) or global (Node.js)

// Function Context (depends on how it's called)
function regularFunction() {
  console.log(this); // undefined in strict mode, Window otherwise
}

// Method Context
const obj = {
  name: "MyObject",
  method: function() {
    console.log(this.name); // "MyObject"
  },
  arrowMethod: () => {
    console.log(this); // Lexical this (parent scope)
  }
};

obj.method(); // "MyObject"

// Constructor Context
function Person(name) {
  this.name = name;
}
const person = new Person("John");
console.log(person.name); // "John"

// Explicit Binding
function greet() {
  console.log(\`Hello, \${this.name}\`);
}

const user = { name: "Alice" };
greet.call(user); // "Hello, Alice"
greet.apply(user); // "Hello, Alice"
const boundGreet = greet.bind(user);
boundGreet(); // "Hello, Alice"

// Arrow Functions (lexical this)
const obj2 = {
  name: "Bob",
  regular: function() {
    setTimeout(function() {
      console.log(this.name); // undefined (this is lost)
    }, 100);
  },
  arrow: function() {
    setTimeout(() => {
      console.log(this.name); // "Bob" (lexical this)
    }, 100);
  }
};`;

const ThisKeywordPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>This Keyword</CardTitle>
        <CardDescription>
          The <code>this</code> keyword refers to the object that is executing
          the current function. Its value depends on how the function is called.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">This Binding Rules</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>Global:</strong> <code>this</code> refers to the global
              object (or undefined in strict mode)
            </li>
            <li>
              <strong>Method:</strong> <code>this</code> refers to the object
              that owns the method
            </li>
            <li>
              <strong>Constructor:</strong> <code>this</code> refers to the
              newly created instance
            </li>
            <li>
              <strong>Explicit:</strong> <code>call()</code>,{" "}
              <code>apply()</code>, or <code>bind()</code> can set{" "}
              <code>this</code>
            </li>
            <li>
              <strong>Arrow Functions:</strong> <code>this</code> is lexically
              bound (from parent scope)
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Key Concepts</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <code>this</code> is determined at runtime, not definition time
            </li>
            <li>
              Arrow functions don't have their own <code>this</code> - they
              inherit it
            </li>
            <li>
              Use <code>bind()</code>, <code>call()</code>, or{" "}
              <code>apply()</code> to explicitly set <code>this</code>
            </li>
            <li>
              In classes, <code>this</code> always refers to the instance
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
          <code>{thisKeywordCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default ThisKeywordPage;
