import { Test } from "@nestjs/testing";
import { DatabaseModule } from "./database.module";

describe("DatabaseModule", () => {
  it("exposes DRIZZLE (Drizzle + neon-http) next to POSTGRES_POOL", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    const drizzleDb = moduleRef.get("DRIZZLE");
    expect(drizzleDb).toBeDefined();
    expect(typeof drizzleDb.select).toBe("function");
  });
});
