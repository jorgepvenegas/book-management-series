import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const booksTable = pgTable("books", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  year: integer().notNull(),
  author: varchar({ length: 255 }).notNull(),
});
