import type { NeonQueryFunction } from "@neondatabase/serverless";
import { neon } from "@neondatabase/serverless";
import { Global, Module } from "@nestjs/common";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { DatabaseController } from "./database.controller";
import { DatabaseService } from "./database.service";
import { schema } from "./schema";

config({
  path: [".env", ".env.production", ".env.local"],
});

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Add it to apps/neon-jwt-api/.env (see README)."
  );
}

const sql: NeonQueryFunction<false, false> = neon(databaseUrl);
const db = drizzle({ client: sql, schema });

const dbProvider = {
  provide: "POSTGRES_POOL",
  useValue: sql,
};

const drizzleProvider = {
  provide: "DRIZZLE",
  useValue: db,
};

@Global()
@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService, dbProvider, drizzleProvider],
  exports: [dbProvider, drizzleProvider],
})
export class DatabaseModule {}
