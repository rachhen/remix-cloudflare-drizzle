import { relations } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  (t) => ({
    id: t.integer("id").notNull().primaryKey({ autoIncrement: true }),
    name: t.text("name").notNull(),
    email: t.text("email").notNull().unique(),
    password: t.text("password").notNull(),
  }),
  (table) => ({
    emailIndex: index("users_email_idx").on(table.email),
  })
);

export const usersRelations = relations(users, () => ({}));

export type UserInsert = typeof users.$inferInsert;
