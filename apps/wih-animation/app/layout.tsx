import "./styles.css";
import { fonts } from "@repo/design-system/lib/fonts";
import { ViewTransitions } from "next-view-transitions";
import type { ReactNode } from "react";

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <ViewTransitions>
    <html className={fonts} lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  </ViewTransitions>
);

export default RootLayout;
