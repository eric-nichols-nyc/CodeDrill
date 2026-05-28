import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DRIZZLE, type DrizzleDb } from "./drizzle";
import { account, session, user, type UserRow } from "./schema";

export type UpsertUserInput = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  emailVerified?: boolean;
};

function displayName(input: UpsertUserInput): string {
  const parts = [input.firstName, input.lastName].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(" ");
  }
  if (input.email) {
    return input.email;
  }
  return "User";
}

function resolveEmail(input: UpsertUserInput): string {
  if (input.email?.trim()) {
    return input.email.trim();
  }
  return `unknown+${input.id}@clerk.invalid`;
}

@Injectable()
export class DatabaseService {
  private readonly db: DrizzleDb;

  constructor(@Inject(DRIZZLE) db: DrizzleDb) {
    this.db = db;
  }

  async findUserById(id: string): Promise<UserRow | undefined> {
    const rows = await this.db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);
    return rows[0];
  }

  async upsertUser(input: UpsertUserInput): Promise<UserRow> {
    const now = new Date();
    const values = {
      id: input.id,
      name: displayName(input),
      email: resolveEmail(input),
      emailVerified: input.emailVerified ?? false,
      image: input.imageUrl ?? null,
      createdAt: now,
      updatedAt: now,
    };

    const rows = await this.db
      .insert(user)
      .values(values)
      .onConflictDoUpdate({
        target: user.id,
        set: {
          name: values.name,
          email: values.email,
          emailVerified: values.emailVerified,
          image: values.image,
          updatedAt: now,
        },
      })
      .returning();

    const row = rows[0];
    if (!row) {
      throw new Error(`Failed to upsert user for id=${input.id}`);
    }
    return row;
  }

  async deleteUserById(id: string): Promise<boolean> {
    if (!id) {
      return false;
    }

    await this.db.delete(session).where(eq(session.userId, id));
    await this.db.delete(account).where(eq(account.userId, id));

    const rows = await this.db
      .delete(user)
      .where(eq(user.id, id))
      .returning({ id: user.id });

    return rows.length > 0;
  }
}
