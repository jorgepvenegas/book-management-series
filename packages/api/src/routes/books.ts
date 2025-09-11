import { Hono } from "hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { booksTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createBookSchema, idSchema, updateBookSchema } from "../db/index.js";

const db = drizzle(process.env.DATABASE_URL!);

const booksRoute = new Hono()
  .get("/", async (c) => {
    const books = await db.select().from(booksTable);
    return c.json(books, { status: 200 });
  })
  .get("/:id", zValidator("param", idSchema), async (c) => {
    const { id } = c.req.valid("param");

    const books = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.id, id))
      .limit(1);

    return c.json(books, { status: 200 });
  })
  .post("/", zValidator("json", createBookSchema), async (c) => {
    const { author, title, year } = c.req.valid("json");

    const newBook: typeof booksTable.$inferInsert = {
      title,
      year,
      author,
    };

    const result = await db.insert(booksTable).values(newBook).returning();

    return c.json(result, { status: 200 });
  })
  .put(
    "/:id",
    zValidator("json", updateBookSchema),
    zValidator("param", idSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");

      const updatedBook = await db
        .update(booksTable)
        .set(data)
        .where(eq(booksTable.id, id))
        .returning();

      return c.json(updatedBook, { status: 200 });
    }
  )
  .delete("/:id", zValidator("param", idSchema), async (c) => {
    const { id } = c.req.valid("param");
    const deletedBook = await db
      .delete(booksTable)
      .where(eq(booksTable.id, id))
      .returning();

    return c.json(deletedBook, { status: 200 });
  });

export default booksRoute;
