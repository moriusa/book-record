ALTER TABLE "books" ADD COLUMN "source" varchar(20) DEFAULT 'catalog' NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "owner_user_id" uuid;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;