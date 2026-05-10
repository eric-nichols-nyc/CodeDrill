import { ConceptPage } from "@/components/concept-page";

const InterceptorsPage = () => (
  <ConceptPage
    description="Wrap execution before and after a handler—ideal for mapping, caching, and logging."
    title="Interceptors"
  >
    <p>
      Interceptors implement{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        NestInterceptor
      </code>{" "}
      and work with RxJS observables around the handler stream. They can
      transform the response, add headers, measure timing, or implement simple
      caching patterns.
    </p>
    <p>
      Use{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        @UseInterceptors()
      </code>{" "}
      on classes or methods, or register globally in{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">main.ts</code>
      . They run after guards and pipes for the incoming side, and wrap the
      handler&apos;s outgoing observable or promise.
    </p>
  </ConceptPage>
);

export default InterceptorsPage;
