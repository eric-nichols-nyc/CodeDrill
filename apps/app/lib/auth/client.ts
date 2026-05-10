"use client";

import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react/ui";
import { createAuthClient } from "@neondatabase/neon-js/auth/next";
import type { ComponentProps } from "react";

/** Matches `NeonAuthUIProvider`’s `authClient` prop without exporting non-portable inferred types. */
export type NeonAuthClient = ComponentProps<typeof NeonAuthUIProvider>["authClient"];

export const authClient = createAuthClient() as NeonAuthClient;
