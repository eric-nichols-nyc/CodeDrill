DROP INDEX IF EXISTS "problem_chat_thread_user_problem_unique";
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "problem_chat_thread_user_problem_idx" ON "problem_chat_thread" USING btree ("user_id","problem_id");
