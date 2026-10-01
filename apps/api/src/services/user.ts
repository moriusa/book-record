import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";

const getCognitoUserInfo = async (token: string) => {
  const response = await fetch(
    "https://book-record-auth.auth.ap-northeast-1.amazoncognito.com/oauth2/userInfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Cognito UserInfo failed: ${response.status}`);
  }

  return response.json() as Promise<{
    sub: string;
    email?: string;
    email_verified?: boolean;
  }>;
};

export const getOrCreateUser = async (
  payload: CognitoJwtPayload,
  token: string,
) => {
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.cognitoSub, payload.sub))
    .limit(1);

  const existingUser = existingUsers[0];

  if (existingUser) {
    return existingUser;
  }

  const userInfo = await getCognitoUserInfo(token);

  const createdUsers = await db
    .insert(users)
    .values({
      cognitoSub: payload.sub,
      email: userInfo.email ?? null,
    })
    .returning();

  return createdUsers[0];
};
