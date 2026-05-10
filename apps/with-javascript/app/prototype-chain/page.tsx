import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const prototypeChainCode = `// Understanding the Prototype Chain

// Base object
const grandparent = {
  property: "grandparent property"
};

// Child object inheriting from grandparent
const parent = Object.create(grandparent);
parent.method = function() {
  return "parent method";
};

// Grandchild inheriting from parent
const child = Object.create(parent);
child.ownProperty = "child property";

// Prototype chain: child -> parent -> grandparent -> Object.prototype -> null
console.log(child.ownProperty); // "child property" (own property)
console.log(child.method()); // "parent method" (from parent)
console.log(child.property); // "grandparent property" (from grandparent)

// Constructor Function Chain
function Animal(name) {
  this.name = name;
}
Animal.prototype.eat = function() {
  return \`\${this.name} is eating\`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // Fix constructor reference

Dog.prototype.bark = function() {
  return \`\${this.name} is barking\`;
};

const myDog = new Dog("Buddy", "Golden Retriever");
console.log(myDog.bark()); // "Buddy is barking"
console.log(myDog.eat()); // "Buddy is eating" (inherited)

// Chain: myDog -> Dog.prototype -> Animal.prototype -> Object.prototype -> null

// Checking the chain
console.log(myDog instanceof Dog); // true
console.log(myDog instanceof Animal); // true
console.log(myDog instanceof Object); // true

// hasOwnProperty vs in operator
console.log(myDog.hasOwnProperty("name")); // true (own property)
console.log("eat" in myDog); // true (inherited)`;

const PrototypeChainPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Prototype Chain</CardTitle>
        <CardDescription>
          The prototype chain is the mechanism by which JavaScript objects
          inherit features from one another. It forms a linked list of prototype
          objects.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">How It Works</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>When accessing a property, JavaScript searches up the chain</li>
            <li>
              It starts with the object itself, then its prototype, then the
              prototype's prototype, etc.
            </li>
            <li>
              The chain ends at <code>Object.prototype</code>, which has{" "}
              <code>null</code> as its prototype
            </li>
            <li>This forms the basis of inheritance in JavaScript</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Property Lookup</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <code>obj.property</code>: Searches entire chain until found or{" "}
              <code>null</code>
            </li>
            <li>
              <code>obj.hasOwnProperty('prop')</code>: Only checks own
              properties
            </li>
            <li>
              <code>'prop' in obj</code>: Checks entire chain
            </li>
            <li>Shadowing: Own properties override inherited ones</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Constructor Functions</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              Constructor's <code>prototype</code> becomes the instance's{" "}
              <code>__proto__</code>
            </li>
            <li>
              Use <code>Object.create()</code> to set up inheritance
            </li>
            <li>
              Always fix the <code>constructor</code> property after setting
              prototype
            </li>
            <li>
              <code>instanceof</code> checks the entire prototype chain
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
          <code>{prototypeChainCode}</code>
        </pre>
      </CardContent>
    </Card>
  </div>
);

export default PrototypeChainPage;
