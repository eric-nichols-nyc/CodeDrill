"use client";

import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { SidebarProvider } from "@repo/design-system/components/ui/sidebar";
import type { ReactNode } from "react";

export type DashboardLayoutProps = {
  /** Content rendered in the fixed left sidebar */
  sidebar: ReactNode;
  /** Content rendered in the sticky top header (e.g. SidebarTrigger + title) */
  header: ReactNode;
  /** Main page content; scrolls within the layout */
  children: ReactNode;
};

function DashboardLayout({ sidebar, header, children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="fixed inset-y-0 left-0 z-20 hidden w-64 md:block">
        {sidebar}
      </div>
      <div className="flex min-h-screen flex-col md:ml-64 md:w-[calc(100vw-16rem)]">
        <header className="sticky top-0 z-10 flex h-14 w-full shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">{header}</div>
          <ModeToggle />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}

export { DashboardLayout };
