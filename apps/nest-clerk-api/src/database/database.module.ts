import { Global, Module } from "@nestjs/common";
import { config } from "dotenv";
import { DatabaseController } from "./database.controller";
import { DatabaseService } from "./database.service";
import { createNeonDrizzle, DRIZZLE, NEON_SQL } from "./drizzle";

config({
  path: [".env", ".env.production", ".env.local"],
});

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Add it to apps/nest-clerk-api/.env (Neon connection string)."
  );
}

const { sql, db } = createNeonDrizzle(databaseUrl);

@Global()
@Module({
  controllers: [DatabaseController],
  providers: [
    DatabaseService,
    { provide: NEON_SQL, useValue: sql },
    { provide: DRIZZLE, useValue: db },
  ],
  exports: [DatabaseService, DRIZZLE, NEON_SQL],
})
export class DatabaseModule {}
