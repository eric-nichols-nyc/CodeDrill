import { ConceptPage } from "@/components/concept-page";

const PipesPage = () => (
  <ConceptPage
    description="Transform payloads and enforce validation before parameters reach your code."
    title="Pipes"
  >
    <p>
      Pipes implement{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        PipeTransform
      </code>
      . Built-ins include{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        ValidationPipe
      </code>{" "}
      (with class-validator) to strip unknown properties and validate DTOs, and
      pipes that parse strings to numbers or enums.
    </p>
    <p>
      Scope pipes globally in{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">main.ts</code>
      , on a controller, or on individual parameters with{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        @UsePipes()
      </code>
      . They run after guards in the pipeline but before the controller method
      executes.
    </p>
  </ConceptPage>
);

export default PipesPage;
