import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Package } from "lucide-react";

export default function NonTrivialPackagesPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">Non-trivial packages</h1>
          <p className="mt-2 text-muted-foreground">
            package.json, lock files, and why keeping dependencies updated
            prevents security breaches
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">
                package.json and lock files
              </CardTitle>
            </div>
            <CardDescription>
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                package.json
              </code>{" "}
              declares your project’s dependencies (and optionally allowed
              version ranges). A <strong>lock file</strong> (
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                package-lock.json
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                pnpm-lock.yaml
              </code>
              , or{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                yarn.lock
              </code>
              ) records the exact versions that were installed, including every
              transitive dependency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Commit the lock file. It gives you reproducible installs across
              machines and CI, and ensures everyone gets the same dependency
              tree. Without it,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                npm install
              </code>{" "}
              or{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                pnpm install
              </code>{" "}
              can resolve to different versions over time, which can introduce
              unexpected behavior or newly disclosed vulnerabilities. For
              applications (not libraries), the lock file is the source of
              truth; keep it in version control.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              Keeping packages updated to prevent security breaches
            </CardTitle>
            <CardDescription>
              Outdated dependencies are a major source of security issues. When
              a CVE is published, attackers quickly target projects that haven’t
              applied the fix.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground text-sm">
              <strong>Why it matters:</strong> Vulnerabilities in dependencies
              (and their transitive deps) can lead to XSS, RCE, prototype
              pollution, or supply-chain attacks. A single vulnerable
              subdependency can compromise your app. Staying updated reduces the
              window of exposure and ensures you get security patches.
            </p>
            <p className="mb-1 font-medium text-muted-foreground text-sm">
              What to do:
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>Run audits regularly:</strong>{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  npm audit
                </code>
                ,{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  pnpm audit
                </code>
                , or{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  yarn npm audit
                </code>{" "}
                report known vulnerabilities. Fix high/critical issues promptly.
              </li>
              <li>
                <strong>Automate updates:</strong> Use Dependabot, Renovate, or
                Snyk to open PRs for dependency updates. Review and merge
                security-related PRs quickly.
              </li>
              <li>
                <strong>Prefer minimal dependency surface:</strong> Fewer
                packages mean fewer things to patch. Avoid pulling in large
                trees for one small feature when you can.
              </li>
              <li>
                <strong>Pin and lock:</strong> Use a lock file and commit it so
                production installs match what you tested. When you upgrade,
                update the lock file and re-run tests and audit.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              How adding trivial packages can cause security breaches
            </CardTitle>
            <CardDescription>
              A “trivial” dependency—a tiny package that does one small
              thing—can still introduce serious risk. Attackers exploit the
              trust we place in the ecosystem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground text-sm">
              <strong>Risks:</strong> <strong>Typosquatting</strong>—packages
              with names like{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                lodash
              </code>{" "}
              vs{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                lodash-
              </code>{" "}
              or{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                loadsh
              </code>{" "}
              can steal credentials or run code at install time.{" "}
              <strong>Malicious or compromised maintainers</strong> can push
              versions that exfiltrate env vars or open backdoors.{" "}
              <strong>Trivial packages</strong> often pull in many transitive
              dependencies, each a potential vulnerability or future maintainer
              takeover. <strong>Install scripts</strong> (
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                postinstall
              </code>
              , etc.) run automatically and can execute arbitrary code on your
              machine and in CI.
            </p>
            <p className="mb-1 font-medium text-muted-foreground text-sm">
              What to do to avoid them:
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>Verify names and publishers:</strong> Double-check
                package name spelling and use official or well-known packages.
                Prefer packages from trusted organizations or with large
                download counts and active maintenance.
              </li>
              <li>
                <strong>Prefer standard library or established libs:</strong> If
                you need a small utility (e.g. left-pad, is-odd), consider
                writing a few lines yourself or using a broad, well-audited
                library (e.g. lodash) instead of adding a one-off package.
              </li>
              <li>
                <strong>Review the dependency tree before adding:</strong>{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  npm info &lt;pkg&gt;
                </code>{" "}
                or the registry page shows dependencies. Prefer packages with
                few or no dependencies when possible.
              </li>
              <li>
                <strong>Be wary of install scripts:</strong> Check what runs on
                install; avoid packages that run network or shell commands
                unless you trust them. Tools like{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  allow-scripts
                </code>{" "}
                (pnpm) can restrict which packages may run scripts.
              </li>
              <li>
                <strong>Lock file + review:</strong> After adding a dependency,
                run install, review the lock file diff for new or changed
                packages, and run audit and tests before merging.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example: package.json and audit</CardTitle>
            <CardDescription>
              Declare dependencies in package.json; let the lock file capture
              exact versions. Run audit in CI or before deploy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2 font-medium text-muted-foreground text-xs">
              package.json (excerpt)
            </p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
              {`{
  "name": "my-app",
  "private": true,
  "dependencies": {
    "next": "16.0.10",
    "react": "19.2.1",
    "zod": "^4.3.6"
  },
  "scripts": {
    "audit": "pnpm audit",
    "postinstall": "pnpm audit --audit-level high"
  }
}`}
            </pre>
            <p className="mt-4 mb-2 font-medium text-muted-foreground text-xs">
              Check for known vulnerabilities
            </p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
              {`# npm
npm audit
npm audit fix          # apply compatible fixes

# pnpm
pnpm audit
pnpm audit --fix       # fix where possible

# In CI: fail the build on high/critical (example)
pnpm audit --audit-level high`}
            </pre>
            <p className="mt-4 text-muted-foreground text-sm">
              Keep the lock file in Git. When you upgrade a dependency, run{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                install
              </code>
              , then{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                audit
              </code>{" "}
              and tests before merging. Automate with Dependabot or Renovate so
              security updates don’t slip.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
