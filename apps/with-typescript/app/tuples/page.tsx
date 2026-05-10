"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { TuplesExamples } from "@/components/examples/tuples";

const tuplesCode = `// Basic tuple - fixed length and types
type Point = [number, number];
const point: Point = [10, 20];

// Tuple with different types
type UserInfo = [string, number, boolean];
const user: UserInfo = ["John", 30, true];

// Optional tuple elements
type OptionalTuple = [string, number?];
const data1: OptionalTuple = ["hello"];
const data2: OptionalTuple = ["hello", 42];

// Rest elements in tuples
type StringNumberBooleans = [string, number, ...boolean[]];
const tuple: StringNumberBooleans = ["hello", 1, true, false, true];

// Readonly tuples
type ReadonlyPoint = readonly [number, number];
const readonlyPoint: ReadonlyPoint = [10, 20];
// readonlyPoint[0] = 5; // Error: Cannot assign

// Named tuple elements (TypeScript 4.0+)
type NamedTuple = [x: number, y: number];
const named: NamedTuple = [10, 20];`;

const TuplesPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Tuples</CardTitle>
        <CardDescription>
          Tuples are arrays with a fixed number of elements, where each element
          can have a different type.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Definition</h3>
          <p className="text-muted-foreground text-sm">
            A tuple is a TypeScript type that represents an array with a fixed
            number of elements, where each element can have a different type.
            This is useful when you need to represent a fixed structure.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Benefits</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Fixed-length arrays with type safety</li>
            <li>Heterogeneous element types</li>
            <li>Better than regular arrays for structured data</li>
            <li>Support for optional and rest elements</li>
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
          <CodeBlock code={tuplesCode} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Example</CardTitle>
        </CardHeader>
        <CardContent>
          <TuplesExamples />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default TuplesPage;
