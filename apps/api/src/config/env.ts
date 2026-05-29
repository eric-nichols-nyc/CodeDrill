/** Required at startup; the service cannot authenticate or read data without these. */
const REQUIRED = ["DATABASE_URL", "CLERK_SECRET_KEY"] as const;

/** Optional, but features degrade when absent — logged as a warning at startup. */
const OPTIONAL: ReadonlyArray<{ key: string; note: string }> = [
  {
    key: "OPENAI_API_KEY",
    note: "tutor chat + problem generation are disabled",
  },
  {
    key: "INTERNAL_PROBLEMS_SECRET",
    note: "server-to-server catalog access via x-internal-problems-secret is disabled",
  },
  {
    key: "CLERK_AUTHORIZED_PARTIES",
    note: "Clerk azp (authorized party) check is skipped",
  },
];

/**
 * Fail fast on missing required env (and warn on optional ones) instead of
 * surfacing as silent 401s or runtime errors deep in a request.
 */
export function validateEnv(): void {
  const missing = REQUIRED.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required env for apps/api: ${missing.join(", ")}. Add them to apps/api/.env (see apps/api/.env.example).`
    );
  }

  for (const { key, note } of OPTIONAL) {
    if (!process.env[key]?.trim()) {
      console.warn(`[env] ${key} is not set — ${note}.`);
    }
  }
}
