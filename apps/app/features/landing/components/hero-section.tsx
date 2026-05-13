import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="border-border border-b py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wide">
          Practice that sticks
        </p>
        <h1 className="mb-6 font-semibold text-4xl text-foreground tracking-tight sm:text-5xl md:text-6xl">
          Sharpen your skills with coding drills
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Work through curated problems, get instant feedback, and keep progress
          in one place. Built for daily practice, not one-off puzzles.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/problems">Browse problems</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/sign-up">Create account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
