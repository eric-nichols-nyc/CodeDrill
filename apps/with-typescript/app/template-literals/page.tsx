"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { TemplateLiteralsExamples } from "@/components/examples/template-literals";

const templateLiteralsCode = `// Basic template literal type
type Greeting = \`Hello, \${string}!\`;

const greet: Greeting = "Hello, World!"; // ✓
// const invalid: Greeting = "Hi there"; // ✗

// Union in template literal
type Event = \`on\${"Click" | "Hover" | "Focus"}\`;

const onClick: Event = "onClick"; // ✓
const onHover: Event = "onHover"; // ✓

// Extract parts from template literal
type ExtractEvent<T> = T extends \`on\${infer E}\` ? E : never;

type ClickEvent = ExtractEvent<"onClick">; // "Click"

// Uppercase/Lowercase/Capitalize utilities
type UppercaseEvent = Uppercase<Event>; // "ONCLICK" | "ONHOVER" | "ONFOCUS"
type LowercaseEvent = Lowercase<Event>; // "onclick" | "onhover" | "onfocus"

// API route type
type ApiRoute = \`/api/\${string}/\${string}\`;

const route: ApiRoute = "/api/users/123"; // ✓

// CSS property type
type CssProperty = \`\${string}-\${string}\`;

const prop: CssProperty = "background-color"; // ✓`;

const TemplateLiteralsPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Template Literal Types</CardTitle>
        <CardDescription>
          Template literal types allow you to create string types based on
          template literal syntax, enabling powerful string manipulation at the
          type level.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Definition</h3>
          <p className="text-muted-foreground text-sm">
            Template literal types are string literal types that can include
            placeholders for other types. They use the same syntax as JavaScript
            template literals but work at the type level.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Features</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>String pattern matching</li>
            <li>Type extraction from strings</li>
            <li>Built-in string manipulation utilities</li>
            <li>API route and CSS property validation</li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Code Example</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={templateLiteralsCode} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Example</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateLiteralsExamples />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default TemplateLiteralsPage;
