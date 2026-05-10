"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { MappedTypesExamples } from "@/components/examples/mapped-types";

const mappedTypesCode = `// Basic mapped type
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type User = {
  name: string;
  age: number;
};

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }

// Optional mapped type
type Optional<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties nullable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Change property types
type Stringify<T> = {
  [P in keyof T]: string;
};

// Filter properties
type OnlyFunctions<T> = {
  [P in keyof T as T[P] extends Function ? P : never]: T[P];
};

// Add prefix to keys
type Prefixed<T, Prefix extends string> = {
  [P in keyof T as \`\${Prefix}\${string & P}\`]: T[P];
};

type PrefixedUser = Prefixed<User, "user_">;
// { user_name: string; user_age: number; }`;

const MappedTypesPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Mapped Types</CardTitle>
        <CardDescription>
          Mapped types allow you to create new types by transforming properties
          of existing types.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Definition</h3>
          <p className="text-muted-foreground text-sm">
            Mapped types iterate over the keys of a type and create a new type
            with transformed properties. They use the syntax [P in keyof T] to
            iterate over keys.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Use Cases</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Making all properties readonly or optional</li>
            <li>Transforming property types</li>
            <li>Filtering or renaming properties</li>
            <li>Creating variations of existing types</li>
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
          <CodeBlock code={mappedTypesCode} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Example</CardTitle>
        </CardHeader>
        <CardContent>
          <MappedTypesExamples />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default MappedTypesPage;
