import { ConceptPage } from "@/components/concept-page";

const ControllersPage = () => (
  <ConceptPage
    description="Define routes and map HTTP verbs to class methods."
    title="Controllers"
  >
    <p>
      Controllers are classes decorated with{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        @Controller(&apos;path&apos;)
      </code>
      . Methods use decorators such as{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">@Get()</code>
      ,{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">@Post()</code>
      ,{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">@Param()</code>
      , and{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">@Body()</code>{" "}
      to bind URLs and payloads to your code.
    </p>
    <p>
      Keep controllers thin: parse/validate shape at the edge (often with pipes),
      call a provider for business logic, and return DTOs or entities. In{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        nest-api
      </code>
      , see{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        AppController
      </code>{" "}
      for the hello-world route wired to{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        AppService
      </code>
      .
    </p>
  </ConceptPage>
);

export default ControllersPage;
