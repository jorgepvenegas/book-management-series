import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { booksTable } from "./db/schema.js";
import { eq } from "drizzle-orm";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors());

const db = drizzle(process.env.DATABASE_URL!);

app.get("/books", async (c) => {
  const books = await db.select().from(booksTable);
  return c.json(books, { status: 200 });
});

app.get("/book/:bookId", async (c) => {
  const bookId = Number(c.req.param("bookId"));

  const books = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.id, bookId))
    .limit(1);

  return c.json(books, { status: 200 });
});

app.post("/book", async (c) => {
  const body = await c.req.json();

  const newBook: typeof booksTable.$inferInsert = {
    title: body.title,
    year: body.year,
    author: body.author,
  };

  const result = await db.insert(booksTable).values(newBook).returning();

  return c.json(result, { status: 200 });
});

app.put("/book/:bookId", async (c) => {
  const bookId = Number(c.req.param("bookId"));
  const bookData = await c.req.json();

  const updatedBook = await db
    .update(booksTable)
    .set(bookData)
    .where(eq(booksTable.id, bookId))
    .returning();

  return c.json(updatedBook, { status: 200 });
});

app.delete("/book/:bookId", async (c) => {
  const bookId = Number(c.req.param("bookId"));
  const deletedBook = await db.delete(booksTable).where(eq(booksTable.id, bookId));

  return c.json(deletedBook, { status: 200 });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
