import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { AuthUserMenu } from "@/features/auth/components/auth-user-menu";

type InterviewShellProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Minimal chrome for static prototype screens.
 */
export function InterviewShell({ children, className }: InterviewShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link className="font-semibold text-sm tracking-tight" href="/">
            AI Interview Coach
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/profile"
            >
              Profile
            </Link>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/interview"
            >
              Interview
            </Link>
            <a
              className="text-muted-foreground transition-colors hover:text-foreground"
              href={
                process.env.NEXT_PUBLIC_CODEDRILL_URL ?? "http://localhost:3010"
              }
            >
              CodeDrill
            </a>
            <Suspense fallback={null}>
              <AuthUserMenu />
            </Suspense>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
