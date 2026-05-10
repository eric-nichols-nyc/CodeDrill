import { ConceptPage } from "@/components/concept-page";

const ModulesPage = () => (
  <ConceptPage
    description="Organize the app into cohesive units with explicit imports and exports."
    title="Modules"
  >
    <p>
      The{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">@Module</code>{" "}
      decorator declares{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        imports
      </code>
      ,{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        controllers
      </code>
      ,{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        providers
      </code>
      , and{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">exports</code>
      . Only exported providers are available to other modules that import this
      module.
    </p>
    <p>
      The root{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        AppModule
      </code>{" "}
      composes feature modules. Shared infrastructure (database, config,
      logging) often lives in dedicated modules imported where needed.
    </p>
  </ConceptPage>
);

export default ModulesPage;
