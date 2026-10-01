import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";

export const getOrCreateUser = async (payload: CognitoJwtPayload) => {
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.cognitoSub, payload.sub))
    .limit(1);

  const existingUser = existingUsers[0];

  if (existingUser) {
    return existingUser;
  }

  const email = typeof payload.email === "string" ? payload.email : null;

  const createdUsers = await db
    .insert(users)
    .values({
      cognitoSub: payload.sub,
      email,
    })
    .returning();

  return createdUsers[0];
};
