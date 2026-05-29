ALTER TABLE "problems" ADD COLUMN IF NOT EXISTS "has_visualizer" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
UPDATE "problems" SET "has_visualizer" = true WHERE "slug" LIKE 'spiral-matrix%';
