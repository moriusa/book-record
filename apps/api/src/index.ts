import { serve } from "@hono/node-server";
import { Hono } from "hono";
import booksRouter from "./routes/books.js";

const app = new Hono();

app.get("/health", (c) => {
  return c.json({
    status: "ok",
  });
});

app.route("/books", booksRouter);

serve({
  fetch: app.fetch,
  port: 3001,
});