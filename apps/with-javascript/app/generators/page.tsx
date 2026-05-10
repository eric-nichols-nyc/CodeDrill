import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const generatorsCode = `// Generator Function
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Infinite Generator
function* infiniteNumbers() {
  let num = 0;
  while (true) {
    yield num++;
  }
}

const infinite = infiniteNumbers();
console.log(infinite.next().value); // 0
console.log(infinite.next().value); // 1
console.log(infinite.next().value); // 2

// Generator with Parameters
function* counter(start) {
  let count = start;
  while (count < start + 3) {
    yield count++;
  }
}

for (const value of counter(10)) {
  console.log(value); // 10, 11, 12
}

// Yielding from Another Generator
function* generator1() {
  yield 1;
  yield 2;
}

function* generator2() {
  yield* generator1(); // Delegation
  yield 3;
  yield 4;
}

for (const value of generator2()) {
  console.log(value); // 1, 2, 3, 4
}

// Two-way Communication
function* twoWayGenerator() {
  const x = yield "First";
  const y = yield x + 1;
  return y + 1;
}

const twoWay = twoWayGenerator();
console.log(twoWay.next()); // { value: "First", done: false }
console.log(twoWay.next(10)); // { value: 11, done: false } (x = 10)
console.log(twoWay.next(20)); // { value: 21, done: true } (y = 20)`;

const GeneratorsPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Generators</CardTitle>
        <CardDescription>
          Generator functions are special functions that can be paused and
          resumed, allowing you to control execution flow and create iterators.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Key Concepts</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              Generator functions use <code>function*</code> syntax
            </li>
            <li>
              <code>yield</code> pauses execution and returns a value
            </li>
            <li>
              <code>.next()</code> resumes execution and returns{" "}
              <code>{"{value, done}"}</code>
            </li>
            <li>
              Can be iterated with <code>for...of</code> loops
            </li>
            <li>Enable lazy evaluation and infinite sequences</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Use Cases</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Creating custom iterators</li>
            <li>Lazy evaluation (generate values on demand)</li>
            <li>Infinite sequences</li>
            <li>Implementing async iteration (with async generators)</li>
            <li>Cooperative multitasking</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Benefits</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>Memory efficient (values generated on demand)</li>
            <li>Can represent infinite sequences</li>
            <li>Two-way communication possible</li>
            <li>Composable (can delegate to other generators)</li>
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
          <code>{generatorsCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default GeneratorsPage;
