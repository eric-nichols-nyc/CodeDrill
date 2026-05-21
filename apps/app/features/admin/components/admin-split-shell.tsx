"use client";

import type { ReactNode } from "react";
import { SplitLayout } from "@/components/split-layout";

type AdminSplitShellProps = {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
  modals?: ReactNode;
};

export function AdminSplitShell({
  header,
  sidebar,
  children,
  modals,
}: AdminSplitShellProps) {
  return (
    <div className="h-[calc(100dvh-1rem)] p-4">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background">
        {header}
        <SplitLayout
          className="min-h-0 flex-1"
          defaultLeftPercent={28}
          left={sidebar}
          minLeftPx={220}
          minRightPx={420}
          right={
            <div className="flex h-full min-h-0 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-6 pb-0">
                {children}
              </div>
            </div>
          }
        />
        {modals}
      </div>
    </div>
  );
}
