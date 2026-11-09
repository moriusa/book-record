CREATE TABLE "book_collection_items" (
	"collection_id" uuid NOT NULL,
	"user_book_id" uuid NOT NULL,
	"position" smallint NOT NULL,
	CONSTRAINT "book_collection_items_collection_id_user_book_id_pk" PRIMARY KEY("collection_id","user_book_id"),
	CONSTRAINT "book_collection_items_collection_position_unique" UNIQUE("collection_id","position")
);
--> statement-breakpoint
CREATE TABLE "book_collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(100) DEFAULT '名刺代わりの本10選' NOT NULL,
	"visibility" varchar(20) DEFAULT 'private' NOT NULL,
	"share_slug" varchar(32),
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "book_collections_share_slug_unique" UNIQUE("share_slug")
);
--> statement-breakpoint
ALTER TABLE "book_collection_items" ADD CONSTRAINT "book_collection_items_collection_id_book_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."book_collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_collection_items" ADD CONSTRAINT "book_collection_items_user_book_id_user_books_id_fk" FOREIGN KEY ("user_book_id") REFERENCES "public"."user_books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_collections" ADD CONSTRAINT "book_collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;