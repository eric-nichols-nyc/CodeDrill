import "./styles.css";
import { ZonesHeaderNav } from "./zones-header-nav";
import { fonts } from "@repo/design-system/lib/fonts";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "With Zones",
  description: "Next.js multi-zones app",
};

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider>
        <ZonesHeaderNav />
        {children}
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
