import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

const usersRouter = new Hono();

usersRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const result = await db.select().from(users).where(eq(users.id, id));

  if (result.length === 0) {
    return c.json(
      {
        message: "Book not found",
      },
      404,
    );
  }

  return c.json(result[0]);
});

usersRouter.post("/", async (c) => {
  const body = await c.req.json();

  const result = await db
    .insert(users)
    .values({
      email: body.email,
      name: body.name,
    })
    .returning();

  return c.json(result[0], 201);
});

export default usersRouter;
