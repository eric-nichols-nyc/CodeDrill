import { ConceptPage } from "@/components/concept-page";

const MiddlewarePage = () => (
  <ConceptPage
    description="Run code before the route handler, similar to Express middleware."
    title="Middleware"
  >
    <p>
      Middleware can be a function or a class implementing{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        NestMiddleware
      </code>
      . It runs in the order you attach it and can inspect the request,
      short-circuit with a response, or call{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">next()</code>
      .
    </p>
    <p>
      Apply middleware in a module&apos;s{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        configure()
      </code>{" "}
      method via{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        MiddlewareConsumer
      </code>
      , targeting routes or controllers. Use middleware for concerns like raw
      request logging, legacy headers, or lightweight checks; prefer guards for
      auth decisions tied to Nest&apos;s execution context.
    </p>
  </ConceptPage>
);

export default MiddlewarePage;
