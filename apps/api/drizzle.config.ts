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
    "DATABASE_URL is not set. Add it to apps/neon-jwt-api/.env for drizzle-kit."
  );
}

/**
 * Tables Drizzle Kit is allowed to manage on `push` / `pull`.
 * Better Auth uses `"user"`, `"session"`, etc. in `public` — they must NOT appear in a push plan as DROP.
 * If `pnpm db:push` still proposes dropping auth tables: cancel, then use `pnpm db:generate` and apply only safe SQL from `drizzle/`, or upgrade `drizzle-kit`.
 */
const practiceTablesFilter = [
  "problems",
  "problem_examples",
  "test_cases",
  "starter_code",
  "tags",
  "problem_tags",
  "problem_hints",
  "problem_solutions",
  "problem_learning_notes",
  "submissions",
  "problem_progress",
  "submission_test_results",
  "problem_chat_thread",
  "problem_chat_message",
] as const;

export default defineConfig({
  // Point at files that `export const … = pgTable(…)` directly. A barrel that only
  // does `export const schema = { problems, … }` can make `push` see an empty schema.
  schema: "./src/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  tablesFilter: [...practiceTablesFilter],
});
