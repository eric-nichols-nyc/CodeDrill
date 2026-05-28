import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const timestamptz = (name: string) =>
  timestamp(name, { withTimezone: true, mode: "date" });

/**
 * Better Auth profile table (existing in shared Neon DB).
 * Clerk JWT `sub` is stored as `user.id`.
 */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamptz("createdAt").notNull(),
  updatedAt: timestamptz("updatedAt").notNull(),
});

/** Legacy Better Auth — used only to delete rows before removing `user`. */
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
});

/** Legacy Better Auth — used only to delete rows before removing `user`. */
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
});

export const schema = {
  user,
  session,
  account,
};

export type UserRow = typeof user.$inferSelect;
export type NewUserRow = typeof user.$inferInsert;
