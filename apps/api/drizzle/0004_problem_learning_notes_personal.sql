ALTER TABLE "problem_learning_notes" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now() NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "problem_learning_notes_user_id_problem_id_unique" ON "problem_learning_notes" USING btree ("user_id","problem_id");
