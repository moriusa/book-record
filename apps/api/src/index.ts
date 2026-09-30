import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import booksRouter from "./routes/books.js";
import usersRouter from "./routes/users.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.route("/users", usersRouter);
app.route("/books", booksRouter);

serve({
  fetch: app.fetch,
  port: 3001,
});

export default app;
