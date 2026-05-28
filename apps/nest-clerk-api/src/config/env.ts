const REQUIRED = ["DATABASE_URL", "CLERK_SECRET_KEY"] as const;

export function getClerkWebhookSecret(): string | undefined {
  return (
    process.env.CLERK_WEBHOOK_SECRET?.trim() ||
    process.env.CLERK_WEBHOOK_SIGNING_SECRET?.trim()
  );
}

export function validateEnv(): void {
  const missing = REQUIRED.filter((key) => !process.env[key]?.trim());
  if (!getClerkWebhookSecret()) {
    missing.push(
      "CLERK_WEBHOOK_SECRET" as (typeof REQUIRED)[number]
    );
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required env for apps/nest-clerk-api: ${missing.join(", ")}. Use CLERK_WEBHOOK_SECRET or CLERK_WEBHOOK_SIGNING_SECRET (Clerk Dashboard → Webhook signing secret).`
    );
  }
}
