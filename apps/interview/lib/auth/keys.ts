import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/** Empty env values become `undefined` so optional keys behave in `.env` files. */
const emptyToUndefined = (v: unknown) =>
  v === "" || v === undefined ? undefined : v;

export const keys = () =>
  createEnv({
    server: {
      CLERK_SECRET_KEY: z.preprocess(
        emptyToUndefined,
        z.string().min(1).optional()
      ),
      /** Nest practice API origin (no trailing path). Same as `apps/app`. */
      NEON_JWT_API_URL: z.preprocess(
        emptyToUndefined,
        z.string().url().optional()
      ),
    },
    client: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.preprocess(
        emptyToUndefined,
        z.string().min(1).optional()
      ),
      NEXT_PUBLIC_SITE_URL: z.preprocess(
        emptyToUndefined,
        z.string().url().optional()
      ),
    },
    runtimeEnv: {
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEON_JWT_API_URL: process.env.NEON_JWT_API_URL,
    },
  });
