import type { ReactNode } from "react";
import { DocsSidebar } from "@/features/docs/components/docs-sidebar";
import { LandingHeader } from "@/features/landing/components/landing-header";

export default function DocsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:h-dvh lg:overflow-hidden">
      <LandingHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <DocsSidebar />
        <div className="min-h-0 min-w-0 flex-1 lg:overflow-y-auto lg:overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
