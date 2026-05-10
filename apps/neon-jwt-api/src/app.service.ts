import { Inject, Injectable } from "@nestjs/common";
import type { NeonQueryFunction } from "@neondatabase/serverless";

@Injectable()
export class AppService {
  constructor(
    @Inject("POSTGRES_POOL")
    private readonly sql: NeonQueryFunction<false, false>
  ) {}

  async getPlayingTable() {
    return await this.sql`SELECT * FROM playing_with_neon`;
  }

  async createPlayingTable() {
    await this.sql`
      CREATE TABLE IF NOT EXISTS playing_with_neon (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      );
    `;
  }

  async insertPlayingRow(name: string, description: string) {
    await this.sql`
      INSERT INTO playing_with_neon (name, description)
      VALUES (${name}, ${description});
    `;
  }

  getHello(): string {
    return "Hello World!";
  }
}
