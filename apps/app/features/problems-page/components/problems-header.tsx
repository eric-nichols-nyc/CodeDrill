"use client";

import { UserMenu } from "@/components/user-menu";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { AppBrandLink } from "@/components/app-brand-link";
import { AppHeaderInner } from "@/components/app-header-inner";

export type ProblemsHeaderProps = {
  className?: string;
};

/**
 * Top bar on `/problems`: brand, list nav, theme, account.
 */
export function ProblemsHeader({ className }: ProblemsHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-border border-b bg-card",
        className
      )}
    >
      <AppHeaderInner>
        <div className="flex min-w-0 items-center gap-6">
          <AppBrandLink />

          <nav className="hidden items-center gap-1 md:flex">
            <Button
              asChild
              className="text-muted-foreground hover:text-foreground"
              size="sm"
              variant="ghost"
            >
              <Link href="/">Home</Link>
            </Button>
            <Button
              className="font-medium text-foreground"
              size="sm"
              variant="ghost"
            >
              Problems
            </Button>
            <Button
              asChild
              className="text-muted-foreground hover:text-foreground"
              size="sm"
              variant="ghost"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </AppHeaderInner>
    </header>
  );
}
