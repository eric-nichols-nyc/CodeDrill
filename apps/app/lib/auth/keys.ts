import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/** Empty env values become `undefined` so `.optional()` and `.url().optional()` behave in `.env` files. */
const emptyToUndefined = (v: unknown) =>
  v === "" || v === undefined ? undefined : v;

export const keys = () =>
  createEnv({
    server: {
      /** Hosted Neon Auth base URL (must be absolute, e.g. https://ep-xxx.neonauth.region.aws.neon.tech). */
      NEON_AUTH_BASE_URL: z.preprocess(
        (v) => (typeof v === "string" ? v.trim() : v),
        z
          .string({
            message:
              "Set NEON_AUTH_BASE_URL in apps/app/.env or .env.local (absolute URL from Neon Auth, or http://localhost:PORT for a local auth server).",
          })
          .min(1, "NEON_AUTH_BASE_URL cannot be empty.")
          .url({
            message:
              "NEON_AUTH_BASE_URL must be a full URL including the scheme (e.g. https://ep-….neonauth….neon.tech or http://localhost:3030), not a bare host like localhost:3030.",
          })
      ),
      /** Optional — local / CI test account (never commit real passwords). */
      NEON_AUTH_TEST_EMAIL: z.preprocess(
        emptyToUndefined,
        z.string().email().optional()
      ),
      NEON_AUTH_TEST_PASSWORD: z.preprocess(
        emptyToUndefined,
        z.string().optional()
      ),
      NEON_AUTH_TEST_NAME: z.preprocess(
        emptyToUndefined,
        z.string().optional()
      ),
      /** Nest `neon-jwt-api` base URL (no trailing path). Used by admin BFF to POST /problems. */
      NEON_JWT_API_URL: z.preprocess(
        emptyToUndefined,
        z.string().url().optional()
      ),
      /**
       * Shared with `neon-jwt-api` `INTERNAL_PROBLEMS_SECRET`. Sent as `x-internal-problems-secret`
       * after Neon session is verified so the Nest `/problems` routes accept the BFF without Better Auth cookies.
       */
      INTERNAL_PROBLEMS_SECRET: z.preprocess(
        emptyToUndefined,
        z.string().min(8).optional()
      ),
    },
    client: {
      NEXT_PUBLIC_SITE_URL: z.preprocess(
        emptyToUndefined,
        z.string().url().optional()
      ),
    },
    runtimeEnv: {
      NEON_AUTH_BASE_URL: process.env.NEON_AUTH_BASE_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEON_AUTH_TEST_EMAIL: process.env.NEON_AUTH_TEST_EMAIL,
      NEON_AUTH_TEST_PASSWORD: process.env.NEON_AUTH_TEST_PASSWORD,
      NEON_AUTH_TEST_NAME: process.env.NEON_AUTH_TEST_NAME,
      NEON_JWT_API_URL: process.env.NEON_JWT_API_URL,
      INTERNAL_PROBLEMS_SECRET: process.env.INTERNAL_PROBLEMS_SECRET,
    },
  });
