CREATE TABLE "interview_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"profile_id" uuid NOT NULL,
	"job_analysis_id" uuid NOT NULL,
	"interview_title" text NOT NULL,
	"estimated_duration_minutes" integer NOT NULL,
	"question_count" integer NOT NULL,
	"categories" text[] NOT NULL,
	"status" text NOT NULL,
	"generated_at" timestamptz DEFAULT now() NOT NULL,
	"started_at" timestamptz,
	"completed_at" timestamptz,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"updated_at" timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT "interview_sessions_status_check" CHECK ("status" IN ('draft', 'ready', 'in_progress', 'completed', 'abandoned')),
	CONSTRAINT "interview_sessions_question_count_check" CHECK ("question_count" >= 1)
);
--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_profile_id_interview_candidate_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."interview_candidate_profiles"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_job_analysis_id_interview_job_analyses_id_fk" FOREIGN KEY ("job_analysis_id") REFERENCES "public"."interview_job_analyses"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "interview_sessions_user_id_status_updated_at_idx" ON "interview_sessions" USING btree ("user_id","status","updated_at" DESC);
--> statement-breakpoint
CREATE TABLE "interview_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"display_order" integer NOT NULL,
	"category" text NOT NULL,
	"difficulty" text NOT NULL,
	"question_text" text NOT NULL,
	"expected_signals" text[] NOT NULL,
	"follow_up_opportunities" text[] NOT NULL,
	"answer_mode" text,
	"transcript" text,
	"duration_seconds" integer,
	"submitted_at" timestamptz,
	"score" integer,
	"strengths" text[],
	"weaknesses" text[],
	"missing_signals" text[],
	"confidence_level" text,
	"suggested_answer" text,
	"recommended_topics" text[],
	"evaluated_at" timestamptz,
	CONSTRAINT "interview_questions_display_order_check" CHECK ("display_order" >= 1),
	CONSTRAINT "interview_questions_answer_mode_check" CHECK ("answer_mode" IS NULL OR "answer_mode" IN ('voice', 'text')),
	CONSTRAINT "interview_questions_score_check" CHECK ("score" IS NULL OR ("score" >= 0 AND "score" <= 100)),
	CONSTRAINT "interview_questions_confidence_level_check" CHECK ("confidence_level" IS NULL OR "confidence_level" IN ('Low', 'Medium', 'High'))
);
--> statement-breakpoint
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_session_id_interview_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."interview_sessions"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "interview_questions_session_id_display_order_idx" ON "interview_questions" USING btree ("session_id","display_order");
