"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { ConditionalTypesExamples } from "@/components/examples/conditional-types";

const conditionalTypesCode = `// Basic conditional type
type IsArray<T> = T extends Array<any> ? true : false;

type Test1 = IsArray<string[]>; // true
type Test2 = IsArray<number>; // false

// Extract array element type
type ArrayElement<T> = T extends Array<infer U> ? U : never;

type Element = ArrayElement<string[]>; // string

// Function return type extraction
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type FuncReturn = ReturnType<() => string>; // string

// Non-nullable type
type NonNullable<T> = T extends null | undefined ? never : T;

type Clean = NonNullable<string | null>; // string

// Flatten array type
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type Flat = Flatten<string[][]>; // string

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;

type StrArrOrNumArr = ToArray<string | number>; // string[] | number[]`;

const ConditionalTypesPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Conditional Types</CardTitle>
        <CardDescription>
          Conditional types allow you to create types that depend on other
          types, enabling powerful type transformations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Definition</h3>
          <p className="text-muted-foreground text-sm">
            Conditional types take the form T extends U ? X : Y, where the type
            is X if T is assignable to U, otherwise Y. They enable type-level
            logic and transformations.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Key Concepts</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Type-level conditionals</li>
            <li>Infer keyword for type extraction</li>
            <li>Distributive conditional types</li>
            <li>Recursive type transformations</li>
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
          <CodeBlock code={conditionalTypesCode} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Example</CardTitle>
        </CardHeader>
        <CardContent>
          <ConditionalTypesExamples />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default ConditionalTypesPage;
