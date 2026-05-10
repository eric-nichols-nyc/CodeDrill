"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { GenericsExamples } from "@/components/examples/generics";

const genericsCode = `// Generic function - works with any type
function identity<T>(arg: T): T {
  return arg;
}

// Generic interface
interface Box<T> {
  value: T;
  getValue(): T;
}

// Generic class
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }
}

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// Constrained generics
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}`;

const GenericsPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Generics</CardTitle>
        <CardDescription>
          Generics enable you to create reusable components that work with
          multiple types while maintaining type safety.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Definition</h3>
          <p className="text-muted-foreground text-sm">
            Generics are a way to make components work with any data type and
            not restrict to one data type. They allow you to write flexible,
            reusable code while maintaining full type safety.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Benefits</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Code reusability</li>
            <li>Type safety without type casting</li>
            <li>Better IntelliSense support</li>
            <li>Compile-time type checking</li>
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
          <CodeBlock code={genericsCode} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Example</CardTitle>
        </CardHeader>
        <CardContent>
          <GenericsExamples />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default GenericsPage;
