"use client";

import { DashboardLayout, ZonesHeader } from "@repo/design-system/components/layout";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import Link from "next/link";
import { AppSidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ZonesHeader linkComponent={Link} />
      <DashboardLayout
        header={
          <>
            <SidebarTrigger />
            <span className="text-muted-foreground text-sm">
              Next.js Optimization Lab
            </span>
          </>
        }
        sidebar={<AppSidebar />}
      >
        {children}
      </DashboardLayout>
    </>
  );
}
