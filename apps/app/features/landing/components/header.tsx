"use client";

import { UserButton } from "@neondatabase/neon-js/auth/react/ui";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-border border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link className="font-semibold text-foreground" href="/">
          Codedrill
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button asChild className="hidden sm:inline-flex" variant="ghost">
            <Link href="/problems">Problems</Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex" variant="ghost">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
          <ModeToggle />
          <UserButton size="icon" />
        </nav>
      </div>
    </header>
  );
}
