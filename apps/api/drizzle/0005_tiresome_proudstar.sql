ALTER TABLE "books" ADD COLUMN "isbn" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "publisher" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "sales_date" varchar(20);--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "image_url" varchar(255);--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "completed_at" date;