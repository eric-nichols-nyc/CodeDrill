import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      /** Hosted Neon Auth base URL (must be absolute, e.g. https://ep-xxx.neonauth.region.aws.neon.tech). */
      NEON_AUTH_BASE_URL: z.string().url(),
      /** Optional — local / CI test account (never commit real passwords). */
      NEON_AUTH_TEST_EMAIL: z.string().email().optional(),
      NEON_AUTH_TEST_PASSWORD: z.string().optional(),
      NEON_AUTH_TEST_NAME: z.string().optional(),
    },
    client: {
      NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
    },
    runtimeEnv: {
      NEON_AUTH_BASE_URL: process.env.NEON_AUTH_BASE_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEON_AUTH_TEST_EMAIL: process.env.NEON_AUTH_TEST_EMAIL,
      NEON_AUTH_TEST_PASSWORD: process.env.NEON_AUTH_TEST_PASSWORD,
      NEON_AUTH_TEST_NAME: process.env.NEON_AUTH_TEST_NAME,
    },
  });
