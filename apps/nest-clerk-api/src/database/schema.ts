import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const timestamptz = (name: string) =>
  timestamp(name, { withTimezone: true, mode: "date" });

/**
 * Local profile for a Clerk account. Child tables should reference `users.id`
 * with `onDelete: "cascade"` when added (progress, submissions, etc.).
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  createdAt: timestamptz("created_at").notNull().defaultNow(),
  updatedAt: timestamptz("updated_at").notNull().defaultNow(),
});

export const schema = {
  users,
};

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
