import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/** Empty env values become `undefined` so `.optional()` and `.url().optional()` behave in `.env` files. */
const emptyToUndefined = (v: unknown) =>
  v === "" || v === undefined ? undefined : v;

export const keys = () =>
  createEnv({
    server: {
      /** Nest `neon-jwt-api` base URL (no trailing path). Auth + catalog upstream. */
      NEON_JWT_API_URL: z.preprocess(
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
      /** Optional — dev sign-in/up form autofill on `/auth/*`. */
      AUTH_TEST_EMAIL: z.preprocess(
        emptyToUndefined,
        z.string().email().optional()
      ),
      AUTH_TEST_PASSWORD: z.preprocess(
        emptyToUndefined,
        z.string().optional()
      ),
      AUTH_TEST_NAME: z.preprocess(
        emptyToUndefined,
        z.string().optional()
      ),
      /** Optional — `POST /api/admin/problems/generate` (natural language → problem JSON). */
      OPENAI_API_KEY: z.preprocess(
        emptyToUndefined,
        z.string().min(10).optional()
      ),
    },
    client: {
      NEXT_PUBLIC_SITE_URL: z.preprocess(
        emptyToUndefined,
        z.string().url().optional()
      ),
    },
    runtimeEnv: {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEON_JWT_API_URL: process.env.NEON_JWT_API_URL,
      INTERNAL_PROBLEMS_SECRET: process.env.INTERNAL_PROBLEMS_SECRET,
      AUTH_TEST_EMAIL: process.env.AUTH_TEST_EMAIL,
      AUTH_TEST_PASSWORD: process.env.AUTH_TEST_PASSWORD,
      AUTH_TEST_NAME: process.env.AUTH_TEST_NAME,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  });
