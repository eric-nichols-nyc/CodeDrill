import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const iteratorsCode = `// Iterable Protocol - must have Symbol.iterator
const iterable = {
  items: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.items.length) {
          return { value: this.items[index++], done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const item of iterable) {
  console.log(item); // 1, 2, 3
}

// Iterator Protocol - must implement next()
const iterator = {
  current: 1,
  end: 5,
  next() {
    if (this.current <= this.end) {
      return { value: this.current++, done: false };
    }
    return { done: true };
  }
};

// Custom Range Iterator
function createRange(start, end) {
  return {
    [Symbol.iterator]() {
      let current = start;
      return {
        next() {
          if (current <= end) {
            return { value: current++, done: false };
          }
          return { done: true };
        }
      };
    }
  };
}

for (const num of createRange(5, 10)) {
  console.log(num); // 5, 6, 7, 8, 9, 10
}

// Built-in Iterables
const arr = [1, 2, 3];
for (const item of arr) { } // Arrays are iterable

const str = "hello";
for (const char of str) { } // Strings are iterable

const map = new Map([["a", 1], ["b", 2]]);
for (const [key, value] of map) { } // Maps are iterable

// Spread Operator with Iterables
const range = createRange(1, 5);
const array = [...range]; // [1, 2, 3, 4, 5]

// Array.from() with Iterables
const doubled = Array.from(createRange(1, 3), x => x * 2); // [2, 4, 6]`;

const IteratorsPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Iterators</CardTitle>
        <CardDescription>
          Iterators are objects that define how to traverse a sequence of
          values. They implement the Iterator and Iterable protocols.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Two Protocols</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>Iterable Protocol:</strong> Object must have{" "}
              <code>Symbol.iterator</code> method
            </li>
            <li>
              <strong>Iterator Protocol:</strong> Must have <code>next()</code>{" "}
              returning <code>{"{value, done}"}</code>
            </li>
            <li>
              Many built-in types are iterable (Arrays, Strings, Maps, Sets)
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Using Iterators</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <code>for...of</code> loops automatically use iterators
            </li>
            <li>
              <code>...spread</code> operator works with iterables
            </li>
            <li>
              <code>Array.from()</code> can convert iterables to arrays
            </li>
            <li>
              <code>destructuring</code> works with iterables
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Benefits</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Unified interface for iteration</li>
            <li>Lazy evaluation possible</li>
            <li>Memory efficient (generate values on demand)</li>
            <li>Works with built-in language features</li>
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
          <code>{iteratorsCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default IteratorsPage;
