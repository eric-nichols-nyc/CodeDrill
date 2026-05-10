"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { IntersectionsExamples } from "@/components/examples/intersections";

const intersectionsCode = `// Intersection types combine multiple types
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: string;
  department: string;
};

// Combined type has all properties
type EmployeePerson = Person & Employee;

const worker: EmployeePerson = {
  name: "John",
  age: 30,
  employeeId: "E123",
  department: "Engineering",
};

// Intersection with function types
type Loggable = {
  log(): void;
};

type Serializable = {
  serialize(): string;
};

type LoggableSerializable = Loggable & Serializable;

// Intersection with primitives
type StringNumber = string & number; // Never type (impossible)
type Possible = string & { length: number }; // String (has length)`;

const IntersectionsPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Intersection Types</CardTitle>
        <CardDescription>
          Intersection types combine multiple types into one, requiring all
          properties from each type.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Definition</h3>
          <p className="text-muted-foreground text-sm">
            An intersection type is created using the ampersand (&) operator. It
            combines multiple types into one, meaning the resulting type must
            satisfy all of the intersected types.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Benefits</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Combine multiple types</li>
            <li>Create complex type compositions</li>
            <li>Mix interfaces and type aliases</li>
            <li>Type-safe property merging</li>
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
          <CodeBlock code={intersectionsCode} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Example</CardTitle>
        </CardHeader>
        <CardContent>
          <IntersectionsExamples />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default IntersectionsPage;
