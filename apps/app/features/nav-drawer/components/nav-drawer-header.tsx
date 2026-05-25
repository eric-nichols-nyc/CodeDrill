"use client";

import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/design-system/components/ui/sheet";
import Link from "next/link";

export function NavDrawerHeader() {
  return (
    <SheetHeader className="shrink-0 border-border border-b pb-4">
      <SheetTitle asChild>
        <Link className="hover:underline" href="/problems">
          Problems
        </Link>
      </SheetTitle>
      <SheetDescription>Jump to another problem</SheetDescription>
    </SheetHeader>
  );
}
