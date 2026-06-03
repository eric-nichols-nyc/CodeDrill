CREATE TABLE "interview_resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"extracted_text" text NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "interview_resumes_user_id_created_at_idx" ON "interview_resumes" USING btree ("user_id","created_at" DESC);
--> statement-breakpoint
CREATE TABLE "interview_candidate_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"resume_id" uuid NOT NULL,
	"summary" text NOT NULL,
	"core_skills" text[] NOT NULL,
	"projects" jsonb NOT NULL,
	"claims_to_verify" jsonb NOT NULL,
	"strength_areas" text[] NOT NULL,
	"potential_gap_areas" text[] NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "interview_candidate_profiles" ADD CONSTRAINT "interview_candidate_profiles_resume_id_interview_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."interview_resumes"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "interview_candidate_profiles_user_id_updated_at_idx" ON "interview_candidate_profiles" USING btree ("user_id","updated_at" DESC);
--> statement-breakpoint
CREATE INDEX "interview_candidate_profiles_resume_id_idx" ON "interview_candidate_profiles" USING btree ("resume_id");
