import { Global, Module } from "@nestjs/common";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import { DatabaseController } from "./database.controller";
import { DatabaseService } from "./database.service";

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

const dbProvider = {
  provide: "POSTGRES_POOL",
  useValue: sql,
};

@Global()
@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService, dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
