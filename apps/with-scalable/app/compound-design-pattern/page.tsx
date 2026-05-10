import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const usageExample = `// Usage: compose the pieces in JSX. Order and which parts you use are flexible.
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Body content here.</p>
  </CardContent>
</Card>`;

const implementationExample = `// 1. Create context for shared state
const CardContext = createContext<CardContextValue | null>(null);

// 2. Root component provides the context and wraps children
function Card({ children, ...props }: CardProps) {
  const [value, setValue] = useState({ ... });
  return (
    <CardContext.Provider value={value}>
      <div data-slot="card" {...props}>{children}</div>
    </CardContext.Provider>
  );
}

// 3. Child components consume context (no prop drilling)
function CardHeader({ children }: CardHeaderProps) {
  const context = useContext(CardContext);
  if (!context) throw new Error("CardHeader must be used within Card");
  return <div data-slot="card-header">{children}</div>;
}

function CardContent({ children }: CardContentProps) {
  const context = useContext(CardContext);
  if (!context) throw new Error("CardContent must be used within Card");
  return <div data-slot="card-content">{children}</div>;
}

// 4. Attach children to the root and export as one API
Card.Header = CardHeader;
Card.Content = CardContent;
export { Card };`;

const CompoundDesignPatternPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">Compound design pattern</h1>
        <p className="mt-2 text-muted-foreground">
          Flexible, composable components that share state and stay scalable
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What is the compound component pattern?</CardTitle>
            <CardDescription>
              A pattern where a parent component (e.g. Card, Tabs, Accordion)
              works together with child components (CardHeader, CardContent,
              TabsList, TabsTrigger) that share implicit state via context. The
              API is compositional: you use the pieces together in markup
              instead of passing everything through one component’s props.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why use it?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">
                Flexible layout and order:{" "}
              </span>
              Callers can arrange or omit subcomponents (e.g. CardHeader then
              CardContent, or only CardContent). You don’t need a prop for every
              variation.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Less prop drilling:{" "}
              </span>
              State (like which tab is active) lives in the parent and is shared
              via context, so children stay simple and you avoid huge prop
              lists.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Discoverable API:{" "}
              </span>
              Components like Card.Header and Card.Content make the structure
              obvious in JSX and scale well as you add more variants or slots.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example</CardTitle>
            <CardDescription>
              This page and the design system use the pattern: Card with
              CardHeader, CardTitle, CardDescription, and CardContent; Tabs with
              TabsList, TabsTrigger, and TabsContent; Accordion with
              AccordionItem, AccordionTrigger, AccordionContent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="mb-2 font-medium text-foreground">
                Usage (how you use it in JSX)
              </p>
              <pre className="w-full min-w-0 overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-sm">
                <code>{usageExample}</code>
              </pre>
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">
                Structure (context + root + children)
              </p>
              <pre className="w-full min-w-0 overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-sm">
                <code>{implementationExample}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
);

export default CompoundDesignPatternPage;
