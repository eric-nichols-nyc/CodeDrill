import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/** Empty env values become `undefined` so `.optional()` and `.url().optional()` behave in `.env` files. */
const emptyToUndefined = (v: unknown) =>
  v === "" || v === undefined ? undefined : v;

export const keys = () =>
  createEnv({
    server: {
      CLERK_SECRET_KEY: z.preprocess(
        emptyToUndefined,
        z.string().min(1).optional()
      ),
      /** Nest `neon-jwt-api` base URL (no trailing path). Catalog + practice BFF upstream. */
      NEON_JWT_API_URL: z.preprocess(
        emptyToUndefined,
        z.string().url().optional()
      ),
      /** `nest-clerk-api` base URL (no trailing path). Identity + profile. */
      NEST_CLERK_API_URL: z.preprocess(
        emptyToUndefined,
        z.string().url().optional()
      ),
      /**
       * Optional — authorizes server-to-server catalog/admin BFF calls to `GET/POST /problems`
       * without a user session. Not used for end-user identity.
       */
      INTERNAL_PROBLEMS_SECRET: z.preprocess(
        emptyToUndefined,
        z.string().min(8).optional()
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
      NEST_CLERK_API_URL: process.env.NEST_CLERK_API_URL,
      INTERNAL_PROBLEMS_SECRET: process.env.INTERNAL_PROBLEMS_SECRET,
    },
  });
