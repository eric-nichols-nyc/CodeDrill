ALTER TABLE "problem_examples" ADD COLUMN IF NOT EXISTS "image_url" text;
--> statement-breakpoint
ALTER TABLE "problem_examples" ADD COLUMN IF NOT EXISTS "image_alt" text;
