import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "@repo/design-system/styles/globals.css";
import { ThemeProvider } from "@repo/design-system/providers/theme";

export const metadata: Metadata = {
  title: "Security Lab",
  description: "Security testing and experimentation app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex h-14 items-center px-4">
              <Link
                className="font-medium text-sm transition-colors hover:text-primary"
                href="/"
              >
                Home
              </Link>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
