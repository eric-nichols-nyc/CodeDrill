import "./styles.css";
import {
  SidebarInset,
  SidebarProvider,
} from "@repo/design-system/components/ui/sidebar";
import { fonts } from "@repo/design-system/lib/fonts";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { Sidenav } from "@/components/sidenav";

export const metadata: Metadata = {
  title: "TypeScript Examples",
  description:
    "Learn TypeScript with interactive examples from basic to advanced",
  icons: {
    icon: "/icon.svg",
  },
};

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider>
        <SidebarProvider>
          <Sidenav />
          <SidebarInset>
            <Header />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
