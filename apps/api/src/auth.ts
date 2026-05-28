import { config } from "dotenv";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { Pool } from "pg";

config({
  path: [".env", ".env.production", ".env.local"],
});

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Add it to apps/neon-jwt-api/.env (same Neon URL you use elsewhere)."
  );
}

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret || secret.length < 32) {
  throw new Error(
    "BETTER_AUTH_SECRET must be set and at least 32 characters (see https://www.better-auth.com/docs/installation)."
  );
}

const baseURL =
  process.env.BETTER_AUTH_URL ?? `http://localhost:${process.env.PORT ?? "3030"}`;

const trustedOrigins = (
  process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "http://localhost:3010"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const auth = betterAuth({
  secret,
  baseURL,
  trustedOrigins,
  database: new Pool({ connectionString: databaseUrl }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [bearer()],
});
