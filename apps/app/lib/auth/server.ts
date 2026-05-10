import "server-only";
import { neonAuth } from "@neondatabase/neon-js/auth/next";

/** Explicit return avoids TS2742 (inferred session type references internal bundles). */
export async function getSession(): Promise<unknown> {
  return await neonAuth();
}
