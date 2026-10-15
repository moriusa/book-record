CREATE TABLE "user_books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"status" varchar(30) NOT NULL,
	"rating" smallint,
	"review" text,
	"completed_at" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_books_user_id_book_id_unique" UNIQUE("user_id","book_id")
);
--> statement-breakpoint
ALTER TABLE "books" DROP CONSTRAINT "books_user_id_isbn_unique";--> statement-breakpoint
ALTER TABLE "books" DROP CONSTRAINT "books_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_books" ADD CONSTRAINT "user_books_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_books" ADD CONSTRAINT "user_books_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "rating";--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "review";--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "completed_at";--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_isbn_unique" UNIQUE("isbn");