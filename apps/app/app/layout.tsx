import { TanStackDevtools } from "@tanstack/react-devtools";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { QueryProvider } from "@/components/providers/query-provider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
        {process.env.NODE_ENV === "development" ? <TanStackDevtools /> : null}
      </body>
    </html>
  );
}
