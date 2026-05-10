import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const principles = [
  {
    letter: "S",
    name: "Single Responsibility Principle (SRP)",
    definition:
      "A class or module should have only one reason to change—i.e., one responsibility.",
    scalability:
      "Small, focused units are easier to test, reuse, and scale. When one concern changes, you touch one place. Teams can own and deploy modules independently without ripple effects.",
  },
  {
    letter: "O",
    name: "Open/Closed Principle (OCP)",
    definition:
      "Software entities should be open for extension but closed for modification.",
    scalability:
      "You add new behavior via new code (extend) instead of editing existing code (modify). That reduces regression risk and lets you scale features without breaking what already works.",
  },
  {
    letter: "L",
    name: "Liskov Substitution Principle (LSP)",
    definition:
      "Subtypes must be substitutable for their base types without breaking correctness.",
    scalability:
      "You can introduce new implementations (e.g., new services or adapters) and swap them in without changing callers. Scaling often means adding variants; LSP keeps them interchangeable.",
  },
  {
    letter: "I",
    name: "Interface Segregation Principle (ISP)",
    definition:
      "Clients should not depend on interfaces they do not use. Prefer many small, specific interfaces over one large one.",
    scalability:
      "Consumers only depend on what they need, so changes in one area don’t force unrelated code to change. Smaller interfaces are easier to version and evolve as the system grows.",
  },
  {
    letter: "D",
    name: "Dependency Inversion Principle (DIP)",
    definition:
      "Depend on abstractions, not concretions. High-level modules should not depend on low-level modules; both should depend on abstractions.",
    scalability:
      "You can plug in new implementations (databases, APIs, services) without rewriting core logic. Scaling often means swapping infrastructure; DIP keeps the core stable and testable.",
  },
];

const SolidPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">SOLID</h1>
        <p className="mt-2 text-muted-foreground">
          Five principles for design that stays maintainable and scalable as your
          app grows
        </p>
      </div>

      <div className="space-y-6">
        {principles.map((p) => (
          <Card key={p.letter}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
                  {p.letter}
                </span>
                <div>
                  <CardTitle>{p.name}</CardTitle>
                  <CardDescription>{p.definition}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  Why it helps with scalability:{" "}
                </span>
                {p.scalability}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </main>
);

export default SolidPage;
