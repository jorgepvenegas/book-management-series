import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { booksTable } from "./db/schema.js";

const app = new Hono();

const db = drizzle(process.env.DATABASE_URL!);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/book", async (c) => {
  const body = await c.req.json();

  const newBook: typeof booksTable.$inferInsert = {
    title: body.title,
    year: body.year,
  };

  const result = await db.insert(booksTable).values(newBook).returning();

  return c.json(result, { status: 200 });
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
