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
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <SheetTitle>Problems</SheetTitle>
          <SheetDescription>Jump to another problem</SheetDescription>
        </div>
        <Link
          className="shrink-0 font-medium text-primary text-sm hover:underline"
          href="/"
        >
          Home
        </Link>
      </div>
    </SheetHeader>
  );
}
