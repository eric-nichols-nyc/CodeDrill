import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const classVsPrototypeCode = `// Prototype-based (ES5)
function PersonPrototype(name) {
  this.name = name;
}
PersonPrototype.prototype.greet = function() {
  return \`Hello, I'm \${this.name}\`;
};

const person1 = new PersonPrototype("John");

// Class-based (ES6) - Syntactic sugar over prototypes
class PersonClass {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return \`Hello, I'm \${this.name}\`;
  }

  // Static method
  static createAnonymous() {
    return new PersonClass("Anonymous");
  }
}

const person2 = new PersonClass("Jane");

// Both work the same way under the hood!
console.log(person1.greet()); // "Hello, I'm John"
console.log(person2.greet()); // "Hello, I'm Jane"

// Inheritance with Prototypes
function AnimalPrototype(name) {
  this.name = name;
}
AnimalPrototype.prototype.eat = function() {
  return \`\${this.name} is eating\`;
};

function DogPrototype(name, breed) {
  AnimalPrototype.call(this, name);
  this.breed = breed;
}
DogPrototype.prototype = Object.create(AnimalPrototype.prototype);
DogPrototype.prototype.constructor = DogPrototype;
DogPrototype.prototype.bark = function() {
  return "Woof!";
};

// Inheritance with Classes
class AnimalClass {
  constructor(name) {
    this.name = name;
  }

  eat() {
    return \`\${this.name} is eating\`;
  }
}

class DogClass extends AnimalClass {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  bark() {
    return "Woof!";
  }
}

// Classes are just syntactic sugar
console.log(typeof PersonClass); // "function"
console.log(PersonClass.prototype.greet); // Function exists`;

const ClassVsPrototypePage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Class vs Prototype</CardTitle>
        <CardDescription>
          ES6 classes are syntactic sugar over JavaScript's existing
          prototype-based inheritance. They don't introduce a new inheritance
          model.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Key Differences</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>Syntax:</strong> Classes provide cleaner, more familiar
              syntax
            </li>
            <li>
              <strong>Hoisting:</strong> Classes are not hoisted (unlike
              function declarations)
            </li>
            <li>
              <strong>Strict Mode:</strong> Class bodies are always in strict
              mode
            </li>
            <li>
              <strong>Under the Hood:</strong> Classes compile to
              prototype-based code
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Class Features</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <code>constructor</code>: Special method for initialization
            </li>
            <li>
              <code>extends</code>: Cleaner inheritance syntax
            </li>
            <li>
              <code>super</code>: Access parent class methods
            </li>
            <li>
              <code>static</code>: Class methods (not on instances)
            </li>
            <li>
              <code>private</code> fields (ES2022): True encapsulation
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">When to Use</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>Classes:</strong> Modern code, better readability,
              familiar OOP syntax
            </li>
            <li>
              <strong>Prototypes:</strong> Legacy code, understanding
              fundamentals, custom patterns
            </li>
            <li>
              Both achieve the same result - choose based on preference and
              codebase
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
          <code>{classVsPrototypeCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default ClassVsPrototypePage;
