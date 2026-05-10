import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const modulesCode = `// Named Exports
export const name = "JavaScript";
export function greet() {
  return "Hello!";
}
export class Calculator {
  add(a, b) {
    return a + b;
  }
}

// Default Export
export default function mainFunction() {
  return "Main function";
}

// Importing
import mainFunction, { name, greet, Calculator } from "./module.js";

// Import with Rename
import { name as moduleName } from "./module.js";

// Import All
import * as utils from "./module.js";
utils.greet();

// Re-exporting
export { greet, Calculator } from "./module.js";
export { default as MainFunction } from "./module.js";

// Dynamic Import (ES2020)
const module = await import("./module.js");
const { greet } = await import("./module.js");

// CommonJS (Node.js - older style)
module.exports = {
  name: "JavaScript",
  greet: function() { }
};

const { name, greet } = require("./module");

// Module Scope
// Variables are module-scoped, not global
const privateVar = "I'm private";
export const publicVar = "I'm public";`;

const ModulesPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Modules</CardTitle>
        <CardDescription>
          ES6 modules provide a way to organize code into reusable units with
          explicit imports and exports, replacing global scope pollution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Export Types</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>Named Exports:</strong> Multiple exports per module (
              <code>export const</code>)
            </li>
            <li>
              <strong>Default Export:</strong> Single export per module (
              <code>export default</code>)
            </li>
            <li>
              <strong>Re-exports:</strong> Export from another module (
              <code>export {} from</code>)
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Import Types</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>Named Imports:</strong> <code>import {name} from</code>
            </li>
            <li>
              <strong>Default Import:</strong>{" "}
              <code>import defaultName from</code>
            </li>
            <li>
              <strong>Namespace Import:</strong>{" "}
              <code>import * as alias from</code>
            </li>
            <li>
              <strong>Dynamic Import:</strong> <code>await import()</code> -
              loads at runtime
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Module Features</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Each module has its own scope (not global)</li>
            <li>Modules are strict mode by default</li>
            <li>Modules are executed once (cached)</li>
            <li>
              Top-level <code>await</code> is allowed in modules (ES2022)
            </li>
            <li>Circular dependencies are handled</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Benefits</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Code organization and reusability</li>
            <li>Avoid global namespace pollution</li>
            <li>Explicit dependencies</li>
            <li>Better tree-shaking for bundlers</li>
            <li>Static analysis friendly</li>
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
          <code>{modulesCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default ModulesPage;
