import "./styles.css";
import { fonts } from "@repo/design-system/lib/fonts";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import type { ReactNode } from "react";
import { AppShell } from "./app-shell";

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider>
        <AppShell>{children}</AppShell>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
