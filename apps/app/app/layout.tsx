import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { QueryProvider } from "@/components/providers/query-provider";
import { ClerkAuthProvider } from "@/features/auth/components/clerk-auth-provider";
import "./styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3010";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  applicationName: "Codedrill",
  title: {
    default: "Codedrill",
    template: "%s · Codedrill",
  },
  description:
    "Codedrill — practice coding problems with instant feedback and durable progress.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Codedrill",
    title: "Codedrill",
    description:
      "Practice coding problems with instant feedback and durable progress.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Codedrill",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codedrill",
    description:
      "Practice coding problems with instant feedback and durable progress.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<ReactNode> {
  // The root layout also renders for 404s/static-asset misses that the proxy
  // matcher intentionally excludes, so `auth()` can run on a request that never
  // hit clerkMiddleware(). Fall back to null instead of crashing the render.
  let userId: string | null = null;
  try {
    userId = (await auth()).userId;
  } catch {
    userId = null;
  }

  return (
    <ClerkProvider allowedRedirectOrigins={["http://localhost:3012"]}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider defaultTheme="dark">
            <ClerkAuthProvider initialUserId={userId ?? null}>
              <QueryProvider>
                {process.env.NODE_ENV === "development" ? (
                  <Link
                    className="fixed bottom-3 left-3 z-50 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 font-mono text-amber-950 text-xs shadow-sm hover:bg-amber-500/20 dark:text-amber-100"
                    href="/admin"
                  >
                    Admin (dev)
                  </Link>
                ) : null}
                {children}
              </QueryProvider>
            </ClerkAuthProvider>
          </ThemeProvider>
          {process.env.NODE_ENV === "development" ? <TanStackDevtools /> : null}
        </body>
      </html>
    </ClerkProvider>
  );
}
