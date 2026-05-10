"use client";

import { createAuthClient } from "@neondatabase/neon-js/auth/next";

export const createNeonAuthClient = () => createAuthClient();

export type NeonAuthClient = ReturnType<typeof createNeonAuthClient>;
