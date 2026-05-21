"use client";

import { cn } from "@repo/design-system/lib/utils";
import { AlignLeft } from "lucide-react";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

export type NavDrawerProblemListTriggerProps =
  ComponentPropsWithoutRef<"button">;

export const NavDrawerProblemListTrigger = forwardRef<
  HTMLButtonElement,
  NavDrawerProblemListTriggerProps
>(function NavDrawerProblemListTrigger(
  { className, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      aria-label="Open problem list"
      className={cn(
        "group flex h-8 shrink-0 items-center gap-1.5 rounded px-1.5 transition-colors hover:bg-white/5",
        className
      )}
      type={type}
      {...props}
    >
      <AlignLeft className="h-4 w-4 text-[var(--nav-icon)] group-hover:text-[var(--nav-icon-hover)]" />
      <span className="whitespace-nowrap font-medium text-[var(--nav-icon-hover)] text-sm">
        Problem List
      </span>
    </button>
  );
});
