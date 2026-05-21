"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  Library,
  Lock,
  Plus,
  Star,
  Swords,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

type NavKey = "library" | "quest" | "explore" | "study-plan";

type NavItemProps = {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  trailing?: ReactNode;
};

function NavRow({ active, icon, label, onClick, trailing }: NavItemProps) {
  return (
    <Button
      className={cn(
        "h-10 w-full justify-start gap-3 rounded-lg px-3 font-normal",
        active
          ? "bg-accent text-accent-foreground shadow-none"
          : "text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground"
      )}
      onClick={onClick}
      type="button"
      variant="ghost"
    >
      <span className="flex shrink-0 items-center [&>svg]:size-5">{icon}</span>
      <span className="flex-1 truncate text-left text-sm">{label}</span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </Button>
  );
}

export function ProblemsNavSidebar() {
  const [active, setActive] = useState<NavKey>("library");

  return (
    <nav className="flex h-full min-h-0 flex-col overflow-y-auto border-border border-r bg-card/80">
      <div className="flex flex-col gap-0.5 p-2">
        <NavRow
          active={active === "library"}
          icon={<Library />}
          label="Library"
          onClick={() => setActive("library")}
        />
        <NavRow
          active={active === "quest"}
          icon={<Swords />}
          label="Quest"
          onClick={() => setActive("quest")}
          trailing={
            <Badge className="border-transparent bg-blue-600 px-1.5 py-0 text-[10px] text-white hover:bg-blue-600/90">
              New
            </Badge>
          }
        />
        <NavRow
          active={active === "explore"}
          icon={<BookOpen />}
          label="Explore"
          onClick={() => setActive("explore")}
        />
        <NavRow
          active={active === "study-plan"}
          icon={<GraduationCap />}
          label="Study plan"
          onClick={() => setActive("study-plan")}
        />
      </div>

      <div className="mx-2 border-border border-t" />

      <div className="flex min-h-0 flex-1 flex-col gap-1 p-2">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="font-medium text-muted-foreground text-xs">
            My lists
          </span>
          <div className="flex items-center gap-0.5">
            <Button
              aria-label="Create list"
              className="size-7 text-muted-foreground"
              size="icon"
              type="button"
              variant="ghost"
            >
              <Plus className="size-4" />
            </Button>
            <Button
              aria-label="List options"
              className="size-7 text-muted-foreground"
              size="icon"
              type="button"
              variant="ghost"
            >
              <ChevronDown className="size-4" />
            </Button>
          </div>
        </div>

        <Button
          className="h-10 w-full justify-start gap-3 rounded-lg px-3 font-normal text-muted-foreground hover:bg-accent/80 hover:text-foreground"
          type="button"
          variant="ghost"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
            <Star className="size-4 fill-yellow-400 text-yellow-500" />
          </span>
          <span className="flex-1 truncate text-left text-foreground text-sm">
            Favorite
          </span>
          <Lock className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </div>
    </nav>
  );
}
