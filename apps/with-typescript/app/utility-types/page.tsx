"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { UtilityTypesExamples } from "@/components/examples/utility-types";

const utilityTypesCode = `// Partial - makes all properties optional
type User = {
  name: string;
  age: number;
  email: string;
};

type PartialUser = Partial<User>;
// { name?: string; age?: number; email?: string; }

// Required - makes all properties required
type OptionalUser = {
  name?: string;
  age?: number;
};

type RequiredUser = Required<OptionalUser>;
// { name: string; age: number; }

// Pick - select specific properties
type UserName = Pick<User, "name" | "email">;
// { name: string; email: string; }

// Omit - remove specific properties
type UserWithoutEmail = Omit<User, "email">;
// { name: string; age: number; }

// Readonly - make all properties readonly
type ReadonlyUser = Readonly<User>;

// Record - create object type with specific keys
type UserRoles = Record<"admin" | "user" | "guest", boolean>;
// { admin: boolean; user: boolean; guest: boolean; }`;

const UtilityTypesPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Utility Types</CardTitle>
        <CardDescription>
          TypeScript provides built-in utility types that help transform and
          manipulate types.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Definition</h3>
          <p className="text-muted-foreground text-sm">
            Utility types are built-in TypeScript types that help you transform
            existing types into new types. They are generic types that take
            other types as parameters.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Common Utility Types</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Partial - makes all properties optional</li>
            <li>Required - makes all properties required</li>
            <li>Pick - selects specific properties</li>
            <li>Omit - removes specific properties</li>
            <li>Readonly - makes properties readonly</li>
            <li>Record - creates object types with specific keys</li>
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
          <CodeBlock code={utilityTypesCode} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Example</CardTitle>
        </CardHeader>
        <CardContent>
          <UtilityTypesExamples />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default UtilityTypesPage;
