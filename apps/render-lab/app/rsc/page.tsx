import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Boxes } from "lucide-react";
import Link from "next/link";

export default function RSCPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/">
          <Button className="mb-4" variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes className="size-5 text-muted-foreground" />
              React Server Components (RSC)
            </CardTitle>
            <CardDescription>
              A React model where components can run on the server and send a
              serialized result to the client instead of shipping component code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">What are React Server Components?</h3>
              <p className="text-muted-foreground text-sm">
                RSC lets you write components that run only on the server. They
                don&apos;t ship JavaScript to the browser: the server renders
                them, serializes the output (HTML-like payload), and the client
                displays that and hydrates only the interactive (client)
                parts. So you get smaller bundles, direct access to server
                resources (DB, file system, secrets), and no need to expose
                data via API routes for those components.
              </p>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">How it works</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>
                  By default in the Next.js App Router, components in the app
                  directory are Server Components.
                </li>
                <li>
                  You mark client-only code with <code className="rounded bg-muted px-1">&quot;use client&quot;</code> so
                  that component (and its subtree) is bundled and runs in the
                  browser.
                </li>
                <li>
                  Server Components can fetch data directly (async/await) with no
                  separate API; they can&apos;t use browser APIs or hooks like
                  useState.
                </li>
                <li>
                  The server sends a serialized RSC payload; the client renders
                  it and attaches event handlers only where Client Components
                  are used.
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 text-sm">
              <p className="font-semibold text-green-600 dark:text-green-400">
                Benefits
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-green-700 dark:text-green-300">
                <li>Smaller client JS: server-only code never ships to the browser</li>
                <li>Direct server access: read from DB, files, or env without an API layer</li>
                <li>Better security: secrets stay on the server</li>
                <li>Composition: pass Server Component output as props to Client Components</li>
              </ul>
            </div>

            <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                In this app
              </p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                This page is a Server Component: it runs on the server, and no
                component code for it is sent to the client. The App Router
                uses RSC by default; pages like SSR, SSG, and ISR are also
                rendered as Server Components unless they include or use
                &quot;use client&quot;.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
