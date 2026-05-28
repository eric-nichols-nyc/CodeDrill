import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DRIZZLE, type DrizzleDb } from "./drizzle";
import { users, type UserRow } from "./schema";

export type UpsertUserInput = {
  clerkUserId: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
};

@Injectable()
export class DatabaseService {
  private readonly db: DrizzleDb;

  constructor(@Inject(DRIZZLE) db: DrizzleDb) {
    this.db = db;
  }

  async findUserByClerkId(clerkUserId: string): Promise<UserRow | undefined> {
    const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);
    return rows[0];
  }

  async upsertUser(input: UpsertUserInput): Promise<UserRow> {
    const now = new Date();
    const rows = await this.db
      .insert(users)
      .values({
        clerkUserId: input.clerkUserId,
        email: input.email ?? null,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        imageUrl: input.imageUrl ?? null,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: users.clerkUserId,
        set: {
          email: input.email ?? null,
          firstName: input.firstName ?? null,
          lastName: input.lastName ?? null,
          imageUrl: input.imageUrl ?? null,
          updatedAt: now,
        },
      })
      .returning();
    const row = rows[0];
    if (!row) {
      throw new Error(`Failed to upsert user for clerkUserId=${input.clerkUserId}`);
    }
    return row;
  }

  async deleteUserByClerkId(clerkUserId: string): Promise<boolean> {
    const rows = await this.db
      .delete(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .returning({ id: users.id });
    return rows.length > 0;
  }
}
