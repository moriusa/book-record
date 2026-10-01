ALTER TABLE "users" ADD COLUMN "cognito_sub" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_cognito_sub_unique" UNIQUE("cognito_sub");