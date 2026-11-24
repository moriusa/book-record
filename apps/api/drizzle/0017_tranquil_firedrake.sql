CREATE TABLE "reading_list_items" (
	"list_id" uuid NOT NULL,
	"user_book_id" uuid NOT NULL,
	"position" smallint NOT NULL,
	CONSTRAINT "reading_list_items_list_id_user_book_id_pk" PRIMARY KEY("list_id","user_book_id"),
	CONSTRAINT "reading_list_items_list_position_unique" UNIQUE("list_id","position")
);
--> statement-breakpoint
CREATE TABLE "reading_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(80) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_books" ADD COLUMN "is_favorite" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reading_list_items" ADD CONSTRAINT "reading_list_items_list_id_reading_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."reading_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_list_items" ADD CONSTRAINT "reading_list_items_user_book_id_user_books_id_fk" FOREIGN KEY ("user_book_id") REFERENCES "public"."user_books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_lists" ADD CONSTRAINT "reading_lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;