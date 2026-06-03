CREATE TABLE "interview_job_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"source_text" text NOT NULL,
	"source_url" text,
	"company_name" text NOT NULL,
	"role_title" text NOT NULL,
	"role_summary" text NOT NULL,
	"required_skills" text[] NOT NULL,
	"nice_to_have_skills" text[] NOT NULL,
	"seniority_level" jsonb NOT NULL,
	"likely_interview_categories" text[] NOT NULL,
	"must_prove" text[] NOT NULL,
	"hidden_expectations" jsonb NOT NULL,
	"interview_signals" text[] NOT NULL,
	"suggested_question_angles" jsonb NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "interview_job_analyses_user_id_created_at_idx" ON "interview_job_analyses" USING btree ("user_id","created_at" DESC);
