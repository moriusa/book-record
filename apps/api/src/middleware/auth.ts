import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { MiddlewareHandler } from "hono";
import { AppEnv } from "../types/hono.js";
import { getOrCreateUser } from "../services/user.js";

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

const verifier = CognitoJwtVerifier.create({
  userPoolId: userPoolId!,
  tokenUse: "access",
  clientId: clientId!,
});

export const authMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const authorization = c.req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const token = authorization.slice("Bearer ".length);

  try {
    const payload = await verifier.verify(token);
    console.log("JWT payload:", payload);
    const user = await getOrCreateUser(payload);

    c.set("user", user);

    await next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    return c.json({ message: "Unauthorized" }, 401);
  }
};
