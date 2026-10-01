import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.js";

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

export default usersRouter;
