import { ConceptPage } from "@/components/concept-page";

const OverviewPage = () => (
  <ConceptPage
    description="What Nest is, how requests flow, and how this doc site relates to your API app."
    title="Overview"
  >
    <p>
      NestJS is a Node.js framework for building server applications—especially
      HTTP APIs and microservices—using TypeScript, decorators, and a structured
      module system inspired by Angular.
    </p>
    <p>
      A typical request passes through middleware, guards, interceptors, and
      pipes before it reaches a controller method. Controllers delegate work to
      providers (usually services) that are wired together by modules and the
      built-in dependency injection container.
    </p>
    <p>
      <strong className="text-foreground">Next.js vs Nest:</strong> Next is
      optimized for React rendering, routing, and full-stack features in the
      same codebase. Nest focuses on backend structure (DI, decorators,
      cross-cutting concerns) and pairs well when you want a dedicated API
      service. In this monorepo,{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        with-nest
      </code>{" "}
      is the conceptual reference;{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        nest-api
      </code>{" "}
      is the minimal Nest starter you can extend while you read these pages.
    </p>
  </ConceptPage>
);

export default OverviewPage;
