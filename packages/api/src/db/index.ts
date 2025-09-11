import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { booksTable } from "./schema.js";
import { z } from "zod";

const bookValidation = {
  title: (schema: z.ZodString) =>
    schema.min(5, "The title should be at least 5 characters"),
  author: (schema: z.ZodString) =>
    schema.min(5, "The author should be at least 5 characters"),
  year: (schema: z.ZodInt) => schema.max(2030, "Isn't that too far out?"),
};

export const createBookSchema = createInsertSchema(booksTable, bookValidation);
export type CreateBookSchema = z.infer<typeof createBookSchema>;

export const bookSchema = createSelectSchema(booksTable);
export type BookSchema = z.infer<typeof bookSchema>;

export const updateBookSchema = createUpdateSchema(booksTable, bookValidation);
export type UpdateBookSchema = z.infer<typeof bookSchema>;

export const idSchema = z.object({
  id: z.coerce.number(),
});

export type IdSchema = z.infer<typeof idSchema>;
