import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./schema";

export const DRIZZLE = Symbol("DRIZZLE");
export const NEON_SQL = Symbol("NEON_SQL");

export type DrizzleDb = NeonHttpDatabase<typeof schema>;

export function createNeonDrizzle(databaseUrl: string): {
  sql: NeonQueryFunction<false, false>;
  db: DrizzleDb;
} {
  const sql = neon(databaseUrl);
  const db = drizzle({ client: sql, schema });
  return { sql, db };
}
