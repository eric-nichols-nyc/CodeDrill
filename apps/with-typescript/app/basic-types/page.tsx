"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { BasicTypesExamples } from "@/components/examples/basic-types";

const basicTypesCode = `// Primitive types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let data: null = null;
let value: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Objects
interface Person {
  name: string;
  age: number;
  email?: string; // Optional property
}

const person: Person = {
  name: "John",
  age: 30,
};

// Functions
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Type inference
let inferred = "Hello"; // TypeScript infers: string
let count = 42; // TypeScript infers: number

// Any and unknown
let anything: any = "can be anything";
let unknownValue: unknown = "needs type checking";`;

const BasicTypesPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Basic Types</CardTitle>
        <CardDescription>
          TypeScript provides several basic types that form the foundation of
          the type system.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Definition</h3>
          <p className="text-muted-foreground text-sm">
            TypeScript includes all JavaScript primitive types (string, number,
            boolean, null, undefined) plus additional types like any, unknown,
            void, and never. You can also define custom types using interfaces
            and type aliases.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Key Types</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Primitives: string, number, boolean, null, undefined</li>
            <li>Arrays: number[], Array&lt;string&gt;</li>
            <li>Objects: interfaces and type aliases</li>
            <li>Functions: parameter and return types</li>
            <li>Special: any, unknown, void, never</li>
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
          <CodeBlock code={basicTypesCode} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Example</CardTitle>
        </CardHeader>
        <CardContent>
          <BasicTypesExamples />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default BasicTypesPage;
