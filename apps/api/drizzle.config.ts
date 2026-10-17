/// <reference types="node" />

import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

const env = process.env.DRIZZLE_ENV ?? "development";

if (!["development", "production"].includes(env)) {
  throw new Error(`Invalid DRIZZLE_ENV: ${env}`);
}

config({
  path: env === "production" ? ".env.production" : ".env",
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
