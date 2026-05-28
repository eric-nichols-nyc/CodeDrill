const REQUIRED = [
  "DATABASE_URL",
  "CLERK_SECRET_KEY",
  "CLERK_WEBHOOK_SECRET",
] as const;

export function validateEnv(): void {
  const missing = REQUIRED.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required env for apps/nest-clerk-api: ${missing.join(", ")}. See README.md.`
    );
  }
}
