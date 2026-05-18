import { Button } from "@repo/design-system/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import { AppBrandLink } from "@/components/app-brand-link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-border border-b px-4 py-4 sm:px-6">
        <AppBrandLink showLabel />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <p className="mb-2 font-mono text-muted-foreground text-sm">404</p>
        <h1 className="mb-3 font-semibold text-3xl text-foreground tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/problems">Browse problems</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
