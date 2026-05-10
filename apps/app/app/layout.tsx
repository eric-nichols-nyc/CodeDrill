import "./styles.css";
import { fonts } from "@repo/design-system/lib/fonts";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        {children}
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
