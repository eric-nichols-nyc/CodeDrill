import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";

export function PlaygroundSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-8 sm:p-12">
          <h2 className="font-semibold text-2xl text-foreground tracking-tight sm:text-3xl">
            Try the playground
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A dedicated space to experiment with snippets and patterns will tie
            into this section. For now, jump into a problem to use the full
            workspace.
          </p>
          <Button asChild className="mt-6">
            <Link href="/problems">Open problems</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
