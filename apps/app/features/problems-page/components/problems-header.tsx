"use client";

import { UserButton } from "@neondatabase/neon-js/auth/react/ui";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { Code2 } from "lucide-react";
import Link from "next/link";

type ProblemsHeaderProps = {
  className?: string;
};

export function ProblemsHeader({ className }: ProblemsHeaderProps) {
  return (
    <header className={cn("border-border border-b bg-card", className)}>
      <div className="flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link className="flex items-center gap-2" href="/">
            <Code2 className="h-6 w-6 text-foreground" />
            <span className="font-semibold text-foreground">Codedrill</span>
          </Link>

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
          <UserButton size="icon" />
        </div>
      </div>
    </header>
  );
}
