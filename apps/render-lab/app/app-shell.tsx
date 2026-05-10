"use client";

import { DashboardLayout, ZonesHeader } from "@repo/design-system/components/layout";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import { AppSidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ZonesHeader />
      <DashboardLayout
        header={
          <>
            <SidebarTrigger />
            <span className="text-muted-foreground text-sm">Render Lab</span>
          </>
        }
        sidebar={<AppSidebar />}
      >
        {children}
      </DashboardLayout>
    </>
  );
}
