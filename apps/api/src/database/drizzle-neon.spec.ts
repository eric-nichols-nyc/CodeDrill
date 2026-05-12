import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./schema";

describe("Drizzle Neon HTTP adapter (Jest)", () => {
  it("drizzle.mock exposes a typed NeonHttpDatabase without a live Neon client", () => {
    const db = drizzle.mock({ schema });
    expect(db.select).toBeDefined();
    expect(db.insert).toBeDefined();
    expect(db.update).toBeDefined();
    expect(db.delete).toBeDefined();
  });
});
