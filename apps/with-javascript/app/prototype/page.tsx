import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const prototypeCode = `// Every object has a prototype
const obj = {};
console.log(obj.__proto__); // Object.prototype
console.log(Object.getPrototypeOf(obj)); // Same, but recommended

// Constructor Functions
function Person(name) {
  this.name = name;
}

// Adding methods to prototype
Person.prototype.greet = function() {
  return \`Hello, I'm \${this.name}\`;
};

const john = new Person("John");
console.log(john.greet()); // "Hello, I'm John"

// Prototype property vs __proto__
console.log(Person.prototype); // Prototype of instances
console.log(john.__proto__ === Person.prototype); // true

// Prototype Chain
console.log(john.toString()); // Inherited from Object.prototype
// john -> Person.prototype -> Object.prototype -> null

// Object.create
const animal = {
  speak() {
    return "Some sound";
  }
};

const dog = Object.create(animal);
dog.breed = "Labrador";
console.log(dog.speak()); // "Some sound" (inherited)

// Setting prototype
const cat = Object.create(animal, {
  breed: { value: "Persian" }
});

// Checking prototype
console.log(Object.getPrototypeOf(dog) === animal); // true
console.log(animal.isPrototypeOf(dog)); // true`;

const PrototypePage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Prototype</CardTitle>
        <CardDescription>
          JavaScript uses prototype-based inheritance. Every object has a
          prototype from which it can inherit properties and methods.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Key Concepts</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              Every JavaScript object has a prototype (except objects created
              with <code>Object.create(null)</code>)
            </li>
            <li>
              <code>__proto__</code> is a reference to the prototype
              (deprecated, use <code>Object.getPrototypeOf()</code>)
            </li>
            <li>
              <code>prototype</code> property exists on constructor functions
            </li>
            <li>
              When accessing a property, JavaScript looks up the prototype chain
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Prototype Chain</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              When accessing a property, JavaScript first checks the object
              itself
            </li>
            <li>If not found, it checks the prototype</li>
            <li>
              This continues up the chain until <code>null</code> is reached
            </li>
            <li>This is how inheritance works in JavaScript</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Methods</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <code>Object.getPrototypeOf(obj)</code>: Get prototype
              (recommended)
            </li>
            <li>
              <code>Object.setPrototypeOf(obj, proto)</code>: Set prototype
              (slow, avoid if possible)
            </li>
            <li>
              <code>Object.create(proto)</code>: Create object with specified
              prototype
            </li>
            <li>
              <code>obj.isPrototypeOf(other)</code>: Check if object is in
              prototype chain
            </li>
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
          <code>{prototypeCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default PrototypePage;
