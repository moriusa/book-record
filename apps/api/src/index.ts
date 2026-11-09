import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import booksRouter from "./routes/books.js";
import collectionsRouter from "./routes/collections.js";
import usersRouter from "./routes/users.js";
import { AppEnv } from "./types/hono.js";

const app = new Hono<AppEnv>();

const corsOrigin = process.env.CORS_ORIGIN;

app.use(
  "*",
  cors({
    origin: corsOrigin,
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.route("/users", usersRouter);
app.route("/books", booksRouter);
app.route("/collections", collectionsRouter);

serve({
  fetch: app.fetch,
  port: 3001,
});

export default app;
