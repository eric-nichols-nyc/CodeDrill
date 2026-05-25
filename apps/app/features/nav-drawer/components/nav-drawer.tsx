"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@repo/design-system/components/ui/sheet";
import { useEffect, useState, type ReactElement } from "react";
import type { Problem } from "@/features/problems-page/lib/types";
import { NavDrawerHeader } from "./nav-drawer-header";
import { NavDrawerProblemList } from "./nav-drawer-problem-list";
import { NavDrawerProblemListTrigger } from "./nav-drawer-problem-list-trigger";

export type NavDrawerProps = {
  problems: Problem[];
  currentSlug: string;
  fetchOk: boolean;
  fetchStatus: number;
  /** Optional custom trigger; must work with `SheetTrigger asChild`. */
  trigger?: ReactElement;
};

/** Left catalog panel (shadcn Sheet, `side="left"`). Feature id: nav-drawer. */
export function NavDrawer({
  problems,
  currentSlug,
  fetchOk,
  fetchStatus,
  trigger = <NavDrawerProblemListTrigger />,
}: NavDrawerProps) {
  const [open, setOpen] = useState(false);
  const [sheetMounted, setSheetMounted] = useState(false);

  useEffect(() => {
    setSheetMounted(true);
  }, []);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      {sheetMounted ? (
        <SheetContent
          className="z-[100] flex w-full flex-col gap-0 p-0 sm:max-w-sm [&>button]:top-3.5 [&>button]:right-3.5"
          side="left"
        >
          <NavDrawerHeader />
          <NavDrawerProblemList
            currentSlug={currentSlug}
            fetchOk={fetchOk}
            fetchStatus={fetchStatus}
            onNavigate={() => setOpen(false)}
            problems={problems}
          />
        </SheetContent>
      ) : null}
    </Sheet>
  );
}
