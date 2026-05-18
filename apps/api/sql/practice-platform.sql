-- CodeDrill practice catalog — apply on Neon for this app (see src/database/schema.ts).
-- Run AFTER Better Auth `user` table exists if you use FKs to "user"(id).

-- =============================================================================
-- CodeDrill / practice platform — consolidated Postgres (Neon) schema
-- =============================================================================
-- Run AFTER Better Auth / Prisma migrations so public."user" exists.
-- All practice user FKs reference "user"(id) (text), same as packages/database.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Problems
-- -----------------------------------------------------------------------------
-- difficulty: LeetCode-style bands for the catalog UI.
-- tutor_level: your own lane (e.g. confidence-rep, pattern-drill) without
--              overloading "easy" from LeetCode semantics.
create table problems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  difficulty text not null
    check (difficulty in ('easy', 'medium', 'hard')),
  description text not null,
  constraints text,
  is_published boolean not null default false,

  -- Tutor / pedagogy (keep out of description so UI can toggle sections)
  pattern_slug text,
  loop_structure text,
  skill_focus text,
  tutor_level text,
  visualization_notes text,
  editorial text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index problems_slug_idx on problems (slug);
create index problems_published_idx on problems (is_published) where is_published = true;
create index problems_pattern_idx on problems (pattern_slug) where pattern_slug is not null;

-- -----------------------------------------------------------------------------
-- Examples (visible in statement)
-- -----------------------------------------------------------------------------
create table problem_examples (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references problems (id) on delete cascade,
  input text not null,
  output text not null,
  explanation text,
  sort_order int not null default 0
);

create index problem_examples_problem_id_idx on problem_examples (problem_id);

-- -----------------------------------------------------------------------------
-- Test cases (judge)
-- -----------------------------------------------------------------------------
-- Use text if you store serialized JSON strings from seeds; migrate to jsonb later
-- if you want structured queries and native JSON in Neon.
create table test_cases (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references problems (id) on delete cascade,
  input text not null,
  expected_output text not null,
  is_sample boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index test_cases_problem_id_idx on test_cases (problem_id);

-- -----------------------------------------------------------------------------
-- Starter code per language
-- -----------------------------------------------------------------------------
create table starter_code (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references problems (id) on delete cascade,
  language text not null,
  code text not null,
  function_name text,
  created_at timestamptz not null default now(),
  unique (problem_id, language)
);

create index starter_code_problem_id_idx on starter_code (problem_id);

-- -----------------------------------------------------------------------------
-- Tags + M:N
-- -----------------------------------------------------------------------------
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table problem_tags (
  problem_id uuid not null references problems (id) on delete cascade,
  tag_id uuid not null references tags (id) on delete cascade,
  primary key (problem_id, tag_id)
);

-- -----------------------------------------------------------------------------
-- Progressive hints (curated; ordered reveal in UI)
-- -----------------------------------------------------------------------------
create table problem_hints (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references problems (id) on delete cascade,
  title text,
  body text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index problem_hints_problem_id_idx on problem_hints (problem_id, sort_order);

-- -----------------------------------------------------------------------------
-- Reference solutions (per language; optional official writeup)
-- -----------------------------------------------------------------------------
create table problem_solutions (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references problems (id) on delete cascade,
  language text not null,
  code text not null,
  explanation text,
  time_complexity text,
  space_complexity text,
  created_at timestamptz not null default now(),
  unique (problem_id, language)
);

create index problem_solutions_problem_id_idx on problem_solutions (problem_id);

-- -----------------------------------------------------------------------------
-- Learning notes: curated (user_id null) OR personal (user_id set)
-- -----------------------------------------------------------------------------
create table problem_learning_notes (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references problems (id) on delete cascade,
  user_id text references "user" (id) on delete cascade,
  note_type text not null
    check (note_type in ('confusion', 'memory_tip', 'pattern_rule', 'mistake', 'other')),
  body text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index problem_learning_notes_problem_id_idx on problem_learning_notes (problem_id);
create index problem_learning_notes_user_id_idx on problem_learning_notes (user_id)
  where user_id is not null;

-- -----------------------------------------------------------------------------
-- Submissions
-- -----------------------------------------------------------------------------
create table submissions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references "user" (id) on delete cascade,
  problem_id uuid not null references problems (id) on delete cascade,
  language text not null,
  code text not null,
  status text not null
    check (
      status in (
        'pending',
        'accepted',
        'wrong_answer',
        'runtime_error',
        'time_limit_exceeded',
        'compile_error'
      )
    ),
  runtime_ms int,
  memory_kb int,
  passed_tests int default 0,
  total_tests int default 0,
  error_message text,
  created_at timestamptz not null default now()
);

create index submissions_user_id_idx on submissions (user_id);
create index submissions_problem_id_idx on submissions (problem_id);
create index submissions_created_at_idx on submissions (created_at desc);

-- -----------------------------------------------------------------------------
-- Per-user saved editor code (e.g. after Run)
-- -----------------------------------------------------------------------------
create table problem_workspace_code (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  problem_id uuid not null references problems (id) on delete cascade,
  language text not null,
  code text not null,
  updated_at timestamptz not null default now(),
  unique (user_id, problem_id, language)
);

create index problem_workspace_code_user_id_idx on problem_workspace_code (user_id);
create index problem_workspace_code_problem_id_idx on problem_workspace_code (problem_id);

-- -----------------------------------------------------------------------------
-- Per-user progress
-- -----------------------------------------------------------------------------
create table problem_progress (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references "user" (id) on delete cascade,
  problem_id uuid not null references problems (id) on delete cascade,
  status text not null default 'not_started'
    check (status in ('not_started', 'attempted', 'solved')),
  is_favorite boolean not null default false,
  best_runtime_ms int,
  best_memory_kb int,
  last_submission_id uuid references submissions (id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (user_id, problem_id)
);

create index problem_progress_problem_id_idx on problem_progress (problem_id);

-- -----------------------------------------------------------------------------
-- Per-test-case results (optional detail)
-- -----------------------------------------------------------------------------
create table submission_test_results (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions (id) on delete cascade,
  test_case_id uuid references test_cases (id) on delete set null,
  status text not null
    check (
      status in (
        'accepted',
        'wrong_answer',
        'runtime_error',
        'time_limit_exceeded',
        'compile_error'
      )
    ),
  actual_output text,
  expected_output text,
  runtime_ms int,
  error_message text,
  created_at timestamptz not null default now()
);

create index submission_test_results_submission_id_idx on submission_test_results (submission_id);

-- -----------------------------------------------------------------------------
-- Auto-update problems.updated_at
-- -----------------------------------------------------------------------------
create or replace function practice_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger problems_set_updated_at
before update on problems
for each row execute function practice_set_updated_at();
