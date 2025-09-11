import { Hono } from "hono";
import booksRoute from "./books.js";
import { cors } from "hono/cors";

const app = new Hono().use(cors()).route("/books", booksRoute);

export type AppType = typeof app;

export default app;
