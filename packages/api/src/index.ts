import { serve } from "@hono/node-server";
import "dotenv/config";
import app from "./routes/index.js";

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
