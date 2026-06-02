import { ThemeProvider } from "@repo/design-system/providers/theme";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  "http://localhost:3012/interview";

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
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  );
}
