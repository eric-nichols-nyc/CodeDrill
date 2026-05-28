import { resolve } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: [
    resolve(__dirname, ".env"),
    resolve(__dirname, ".env.local"),
    resolve(__dirname, ".env.production"),
  ],
});

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Add it to apps/nest-clerk-api/.env for drizzle-kit."
  );
}

export default defineConfig({
  schema: "./src/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
