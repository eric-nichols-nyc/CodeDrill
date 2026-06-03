import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkAuthProvider } from "@/features/auth/components/clerk-auth-provider";
import { auth } from "@/lib/auth/clerk-server";
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
  "http://localhost:3012";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "AI Interview Coach",
  title: {
    default: "AI Interview Coach",
    template: "%s · AI Interview Coach",
  },
  description:
    "Personalized mock interviews from your resume and target job description.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Root layout also renders for 404s the proxy matcher excludes; avoid throwing.
  let userId: string | null = null;
  try {
    userId = (await auth()).userId;
  } catch {
    userId = null;
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider defaultTheme="dark">
            <ClerkAuthProvider initialUserId={userId ?? null}>
              {children}
            </ClerkAuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
