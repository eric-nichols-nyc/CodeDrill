import "./styles.css";
import { fonts } from "@repo/design-system/lib/fonts";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import type { ReactNode } from "react";
import { Providers } from "./providers";

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider>
        <Providers>{children}</Providers>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
