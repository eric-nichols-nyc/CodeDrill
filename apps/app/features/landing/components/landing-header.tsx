"use client";

import { UserButton } from "@neondatabase/neon-js/auth/react/ui";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { AppBrandLink } from "@/components/app-brand-link";
import { AppHeaderInner } from "@/components/app-header-inner";

export type LandingHeaderProps = {
  className?: string;
};

/**
 * Marketing site top bar: brand, primary nav, auth, theme, account.
 */
export function LandingHeader({ className }: LandingHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-border border-b bg-card/95 backdrop-blur-sm",
        className
      )}
    >
      <AppHeaderInner>
        <div className="flex min-w-0 items-center gap-6">
          <AppBrandLink showLabel />
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
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
      </AppHeaderInner>
    </header>
  );
}
