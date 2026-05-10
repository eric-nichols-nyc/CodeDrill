import "./styles.css";
import {
  SidebarInset,
  SidebarProvider,
} from "@repo/design-system/components/ui/sidebar";
import { fonts } from "@repo/design-system/lib/fonts";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Chatbot } from "@/components/chatbot";
import { Header } from "@/components/header";
import { Sidenav } from "@/components/sidenav";
import { PageContextProvider } from "@/contexts/page-context";

export const metadata: Metadata = {
  title: "SOLID Principles",
  description: "Learn SOLID principles with interactive React examples",
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
        <PageContextProvider>
          <SidebarProvider>
            <Sidenav />
            <SidebarInset>
              <Header />
              {children}
            </SidebarInset>
          </SidebarProvider>
          <Chatbot />
        </PageContextProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
