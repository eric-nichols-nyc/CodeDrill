import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const DesignSystemsPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">Design systems</h1>
        <p className="mt-2 text-muted-foreground">
          Shared UI foundations and components that keep products consistent and
          teams moving fast at scale
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What is a design system?</CardTitle>
            <CardDescription>
              A set of reusable components, patterns, tokens (colors, spacing,
              typography), and guidelines—code and documentation—so multiple
              apps or teams build UIs that look and behave consistently.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why design systems help scale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">
                Consistency and quality:{" "}
              </span>
              Buttons, forms, and layouts come from one source. As you add
              features and apps, the bar for accessibility, performance, and
              UX stays high without each team re-solving the same problems.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Speed and autonomy:{" "}
              </span>
              Teams compose instead of building from scratch. New flows and
              products ship faster; design-system updates propagate to all
              consumers, so scale doesn’t mean endless one-off implementations.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Clear contracts:{" "}
              </span>
              Components expose props and variants. Design and engineering align
              on “what exists” and “how to use it,” which scales communication
              as the org and number of products grow.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Theming and branding:{" "}
              </span>
              Tokens and theme layers make it possible to support multiple
              brands or themes from one component set—scaling to more products
              or tenants without duplicating UI code.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What’s usually in a design system</CardTitle>
            <CardDescription>
              Typical building blocks in code and docs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                <strong className="text-foreground">Primitives</strong> — Button, Input,
                Card, Modal, etc., with variants and accessibility built in
              </li>
              <li>
                <strong className="text-foreground">Tokens</strong> — Colors, spacing,
                typography, shadows as shared variables or theme objects
              </li>
              <li>
                <strong className="text-foreground">Layout</strong> — Grid, Stack, Container,
                responsive utilities used across apps
              </li>
              <li>
                <strong className="text-foreground">Patterns</strong> — Composed flows (e.g.
                forms, dashboards, empty states) and when to use them
              </li>
              <li>
                <strong className="text-foreground">Documentation</strong> — Storybook or
                similar for discovery, usage, and design guidelines
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
);

export default DesignSystemsPage;
