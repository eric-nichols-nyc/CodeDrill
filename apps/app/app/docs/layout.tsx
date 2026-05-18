import { DocsSidebar } from "@/features/docs/components/docs-sidebar";
import { LandingHeader } from "@/features/landing/components/landing-header";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <div className="flex flex-1 flex-col lg:flex-row">
        <DocsSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
