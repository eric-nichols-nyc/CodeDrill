import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const StorybookPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">Storybook</h1>
        <p className="mt-2 text-muted-foreground">
          Develop and document UI components in isolation so design systems
          stay discoverable and scalable
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What is Storybook?</CardTitle>
            <CardDescription>
              A tool for building and documenting UI components in isolation.
              You write “stories” that render a component in different states and
              variants; Storybook runs as a separate app so you can browse,
              develop, and test components without running the full product.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why use it for scale?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">
                Single source of truth:{" "}
              </span>
              Every component and its variants live in one place. As the library
              grows, designers and engineers can discover what exists and how to
              use it without digging through apps or code.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Develop in isolation:{" "}
              </span>
              You build and debug a component without navigating through the
              app or mocking data. That speeds up iteration and keeps the
              design system maintainable as you add more components.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Documentation and testing:{" "}
              </span>
              Stories double as usage docs and as a target for visual
              regression or interaction tests. When you add a new variant, you
              add a story and the docs and test surface grow with the system.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typical setup</CardTitle>
            <CardDescription>
              What you usually have in a Storybook for a design system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                <strong className="text-foreground">Stories</strong> — One or more
                stories per component (e.g. default, disabled, loading) with
                controls for props
              </li>
              <li>
                <strong className="text-foreground">Addons</strong> — Controls (knobs),
                accessibility checks, viewport, themes, or custom addons
              </li>
              <li>
                <strong className="text-foreground">Docs</strong> — Auto-generated or
                custom docs with usage guidelines and code examples
              </li>
              <li>
                <strong className="text-foreground">Testing</strong> — Visual or
                interaction tests (e.g. Chromatic, Playwright) run against
                stories
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
);

export default StorybookPage;
