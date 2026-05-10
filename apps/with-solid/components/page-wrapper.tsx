"use client";

import type { ReactNode } from "react";
import { PageContextProvider } from "@/contexts/page-context";

type PageWrapperProps = {
  children: ReactNode;
  context?: string;
};

/**
 * Wrapper component for pages to set their context for the chatbot
 * Usage: Wrap your page content with this component and pass the context
 */
export function PageWrapper({ children, context }: PageWrapperProps) {
  return (
    <PageContextProvider context={context}>{children}</PageContextProvider>
  );
}
