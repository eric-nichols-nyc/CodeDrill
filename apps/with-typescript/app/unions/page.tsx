"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { UnionExamples } from "@/components/examples/unions";

const unionsCode = `// Union Types allow a value to be one of several types
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

// Function with union parameter
function processStatus(status: Status) {
  if (status === "pending") {
    return "Processing...";
  } else if (status === "approved") {
    return "✓ Approved";
  } else {
    return "✗ Rejected";
  }
}

// Union with different object shapes
type User =
  | { type: "admin"; permissions: string[] }
  | { type: "guest"; accessLevel: number };

function getUserAccess(user: User) {
  if (user.type === "admin") {
    return user.permissions; // TypeScript knows this is admin
  } else {
    return user.accessLevel; // TypeScript knows this is guest
  }
}`;

const UnionsPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Union Types</CardTitle>
        <CardDescription>
          Union types allow a value to be one of several types, providing
          flexibility while maintaining type safety.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Definition</h3>
          <p className="text-muted-foreground text-sm">
            A union type is created using the pipe (|) operator, allowing a
            value to be one of several types. TypeScript uses type narrowing to
            determine the specific type at runtime.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Benefits</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Flexible type definitions</li>
            <li>Type-safe handling of multiple possibilities</li>
            <li>Better code documentation</li>
            <li>Compile-time error checking</li>
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
          <CodeBlock code={unionsCode} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Example</CardTitle>
        </CardHeader>
        <CardContent>
          <UnionExamples />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default UnionsPage;
