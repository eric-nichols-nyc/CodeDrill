import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const MonoreposPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">Monorepos</h1>
        <p className="mt-2 text-muted-foreground">
          One repository, many packages—how monorepos support scalable
          codebases and teams
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What is a monorepo?</CardTitle>
            <CardDescription>
              A single version-controlled repository that contains multiple
              projects or packages (e.g. apps, shared libs, design systems)
              instead of splitting them across many repos.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why use a monorepo for scale?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">
                Shared code and refactors:{" "}
              </span>
              Shared packages (UI, utils, API clients) live in one place.
              Refactors and type changes can be done across the whole codebase in
              a single PR, so consistency scales with the number of apps.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Atomic changes:{" "}
              </span>
              You can change an app and its dependency in one commit. No
              version-publish-wait-update cycles; fewer version skew and
              “works in repo A, broken in repo B” issues.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Unified tooling and CI:{" "}
              </span>
              One place for lint, test, build, and deploy config. Easier to
              enforce standards and scale tooling as the org grows.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Cross-project visibility:{" "}
              </span>
              Dependencies between apps and packages are explicit (e.g.
              workspace protocol). You see impact before merging and scale
              ownership and reviews more predictably.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common tooling</CardTitle>
            <CardDescription>
              Workspace managers and build systems that make monorepos practical
              at scale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                <strong className="text-foreground">pnpm / npm / Yarn workspaces</strong> — link
                local packages, single install, workspace: protocol
              </li>
              <li>
                <strong className="text-foreground">Turborepo, Nx</strong> — caching, task
                pipelines, and affected builds so only what changed runs
              </li>
              <li>
                <strong className="text-foreground">Changesets</strong> — versioning and
                changelogs for publishable packages in the monorepo
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
);

export default MonoreposPage;
