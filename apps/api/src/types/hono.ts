import { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";

export type AppEnv = {
  Variables: {
    user: CognitoJwtPayload;
  };
};
