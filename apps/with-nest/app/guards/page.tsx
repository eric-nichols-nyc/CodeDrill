import { ConceptPage } from "@/components/concept-page";

const GuardsPage = () => (
  <ConceptPage
    description="Authorize requests and decide whether a route should run."
    title="Guards"
  >
    <p>
      Guards implement{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        CanActivate
      </code>{" "}
      and return a boolean or a Promise/Observable of one. They run after
      middleware but before pipes and interceptors (per route handler).
    </p>
    <p>
      Typical uses: JWT or session checks, role-based access, feature flags.
      Attach with{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        @UseGuards()
      </code>{" "}
      on controllers or methods, or register globally. Throwing{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        UnauthorizedException
      </code>{" "}
      or{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-foreground">
        ForbiddenException
      </code>{" "}
      produces the right HTTP errors.
    </p>
  </ConceptPage>
);

export default GuardsPage;
