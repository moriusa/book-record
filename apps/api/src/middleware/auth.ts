import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { MiddlewareHandler } from "hono";
import { AppEnv } from "../types/hono.js";

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

console.log("userPoolId:", userPoolId);
console.log("clientId:", clientId);

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

    c.set("user", payload);

    await next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    return c.json({ message: "Unauthorized" }, 401);
  }
};
