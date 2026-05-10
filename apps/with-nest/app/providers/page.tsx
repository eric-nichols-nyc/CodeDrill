import { ConceptPage } from "@/components/concept-page";

const ProvidersPage = () => (
  <ConceptPage
    description="Services and other injectables registered in the DI container."
    title="Providers"
  >
    <p>
      A provider is usually a class decorated with{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        @Injectable()
      </code>
      . Nest constructs a single shared instance per scope (default: singleton)
      and injects it wherever you declare it in a constructor.
    </p>
    <p>
      Register providers in a module&apos;s{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        providers
      </code>{" "}
      array. Controllers and other providers list dependencies in their
      constructors; Nest resolves the graph automatically.
    </p>
    <p>
      In{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">nest-api</code>
      ,{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        AppService
      </code>{" "}
      is a provider consumed by{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        AppController
      </code>
      .
    </p>
  </ConceptPage>
);

export default ProvidersPage;
