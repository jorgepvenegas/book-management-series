import { Hono } from "hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { booksTable } from "../db/schema.js";
import { DrizzleQueryError, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createBookSchema, idSchema, updateBookSchema } from "../db/index.js";

const db = drizzle(process.env.DATABASE_URL!);

const booksRoute = new Hono()
  .get("/", async (c) => {
    try {
      const books = await db.select().from(booksTable);
      return c.json(books, { status: 200 });
    } catch (err) {
      if (err instanceof DrizzleQueryError) {
        return c.json({ error: "Database error", details: err.message }, 500);
      }
      return c.json({ error: "Failed to fetch books" }, 500);
    }
  })
  .get("/:id", zValidator("param", idSchema), async (c) => {
    const { id } = c.req.valid("param");

    try {
      const books = await db
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, id))
        .limit(1);

      return c.json(books, { status: 200 });
    } catch (err) {
      if (err instanceof DrizzleQueryError) {
        return c.json({ error: "Database error", details: err.message }, 500);
      }
      return c.json({ error: "Failed to fetch book" }, 500);
    }
  })
  .post("/", zValidator("json", createBookSchema), async (c) => {
    const { author, title, year } = c.req.valid("json");

    const newBook: typeof booksTable.$inferInsert = {
      title,
      year,
      author,
    };

    try {
      const result = await db.insert(booksTable).values(newBook).returning();
      return c.json(result, { status: 200 });
    } catch (err) {
      if (err instanceof DrizzleQueryError) {
        return c.json({ error: "Database error", details: err.message }, 500);
      }
      return c.json({ error: "Failed to create a book" }, 500);
    }
  })
  .put(
    "/:id",
    zValidator("json", updateBookSchema),
    zValidator("param", idSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");

      try {
        const updatedBook = await db
          .update(booksTable)
          .set(data)
          .where(eq(booksTable.id, id))
          .returning();

        return c.json(updatedBook, { status: 200 });
      } catch (err) {
        if (err instanceof DrizzleQueryError) {
          return c.json({ error: "Database error", details: err.message }, 500);
        }
        return c.json({ error: "Failed to update book" }, 500);
      }
    }
  )
  .delete("/:id", zValidator("param", idSchema), async (c) => {
    const { id } = c.req.valid("param");
    try {
      const deletedBook = await db
        .delete(booksTable)
        .where(eq(booksTable.id, id))
        .returning();

      return c.json(deletedBook, { status: 200 });
    } catch (err) {
      if (err instanceof DrizzleQueryError) {
        return c.json({ error: "Database error", details: err.message }, 500);
      }
      return c.json({ error: "Failed to delete book" }, 500);
    }
  });

export default booksRoute;
