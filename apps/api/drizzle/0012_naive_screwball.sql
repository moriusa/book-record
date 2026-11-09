ALTER TABLE "book_collections" DROP CONSTRAINT "book_collections_share_slug_unique";--> statement-breakpoint
ALTER TABLE "book_collections" DROP COLUMN "visibility";--> statement-breakpoint
ALTER TABLE "book_collections" DROP COLUMN "share_slug";--> statement-breakpoint
ALTER TABLE "book_collections" DROP COLUMN "published_at";