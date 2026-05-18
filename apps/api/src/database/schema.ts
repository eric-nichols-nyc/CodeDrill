import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const timestamptz = (name: string) =>
  timestamp(name, { withTimezone: true, mode: "date" });

export const problems = pgTable(
  "problems",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    difficulty: text("difficulty").notNull(),
    description: text("description").notNull(),
    constraints: text("constraints"),
    isPublished: boolean("is_published").notNull().default(false),
    patternSlug: text("pattern_slug"),
    loopStructure: text("loop_structure"),
    skillFocus: text("skill_focus"),
    tutorLevel: text("tutor_level"),
    visualizationNotes: text("visualization_notes"),
    editorial: text("editorial"),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
    updatedAt: timestamptz("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    difficultyCheck: check(
      "problems_difficulty_check",
      sql`${t.difficulty} in ('easy', 'medium', 'hard')`
    ),
    patternIdx: index("problems_pattern_idx").on(t.patternSlug),
    publishedIdx: index("problems_published_idx").on(t.isPublished),
  })
);

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const problemExamples = pgTable(
  "problem_examples",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    input: text("input").notNull(),
    output: text("output").notNull(),
    explanation: text("explanation"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => ({
    problemIdx: index("problem_examples_problem_id_idx").on(t.problemId),
  })
);

export const testCases = pgTable(
  "test_cases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    input: text("input").notNull(),
    expectedOutput: text("expected_output").notNull(),
    isSample: boolean("is_sample").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (t) => ({
    problemIdx: index("test_cases_problem_id_idx").on(t.problemId),
  })
);

export const starterCode = pgTable(
  "starter_code",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    language: text("language").notNull(),
    code: text("code").notNull(),
    functionName: text("function_name"),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (t) => ({
    problemLangUnique: uniqueIndex("starter_code_problem_id_language_unique").on(
      t.problemId,
      t.language
    ),
    problemIdx: index("starter_code_problem_id_idx").on(t.problemId),
  })
);

export const problemTags = pgTable(
  "problem_tags",
  {
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.problemId, t.tagId] }),
  })
);

export const problemHints = pgTable(
  "problem_hints",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    title: text("title"),
    body: text("body").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (t) => ({
    problemSortIdx: index("problem_hints_problem_id_idx").on(
      t.problemId,
      t.sortOrder
    ),
  })
);

export const problemSolutions = pgTable(
  "problem_solutions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    language: text("language").notNull(),
    code: text("code").notNull(),
    explanation: text("explanation"),
    timeComplexity: text("time_complexity"),
    spaceComplexity: text("space_complexity"),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (t) => ({
    problemLangUnique: uniqueIndex("problem_solutions_problem_id_language_unique").on(
      t.problemId,
      t.language
    ),
    problemIdx: index("problem_solutions_problem_id_idx").on(t.problemId),
  })
);

export const problemLearningNotes = pgTable(
  "problem_learning_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    userId: text("user_id"),
    noteType: text("note_type").notNull(),
    body: text("body").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (t) => ({
    noteTypeCheck: check(
      "problem_learning_notes_note_type_check",
      sql`${t.noteType} in ('confusion', 'memory_tip', 'pattern_rule', 'mistake', 'other')`
    ),
    problemIdx: index("problem_learning_notes_problem_id_idx").on(t.problemId),
    userIdx: index("problem_learning_notes_user_id_idx").on(t.userId),
  })
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    language: text("language").notNull(),
    code: text("code").notNull(),
    status: text("status").notNull(),
    runtimeMs: integer("runtime_ms"),
    memoryKb: integer("memory_kb"),
    passedTests: integer("passed_tests").notNull().default(0),
    totalTests: integer("total_tests").notNull().default(0),
    errorMessage: text("error_message"),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (t) => ({
    statusCheck: check(
      "submissions_status_check",
      sql`${t.status} in (
        'pending',
        'accepted',
        'wrong_answer',
        'runtime_error',
        'time_limit_exceeded',
        'compile_error'
      )`
    ),
    userIdx: index("submissions_user_id_idx").on(t.userId),
    problemIdx: index("submissions_problem_id_idx").on(t.problemId),
    createdIdx: index("submissions_created_at_idx").on(t.createdAt),
  })
);

/** Last saved editor text per user, problem, and language (e.g. after Run). */
export const problemWorkspaceCode = pgTable(
  "problem_workspace_code",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    language: text("language").notNull(),
    code: text("code").notNull(),
    updatedAt: timestamptz("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    userProblemLangUnique: uniqueIndex(
      "problem_workspace_code_user_problem_language_key"
    ).on(t.userId, t.problemId, t.language),
    userIdx: index("problem_workspace_code_user_id_idx").on(t.userId),
    problemIdx: index("problem_workspace_code_problem_id_idx").on(t.problemId),
  })
);

export const problemProgress = pgTable(
  "problem_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("not_started"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    bestRuntimeMs: integer("best_runtime_ms"),
    bestMemoryKb: integer("best_memory_kb"),
    lastSubmissionId: uuid("last_submission_id").references(() => submissions.id, {
      onDelete: "set null",
    }),
    updatedAt: timestamptz("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    statusCheck: check(
      "problem_progress_status_check",
      sql`${t.status} in ('not_started', 'attempted', 'solved')`
    ),
    userProblemUnique: uniqueIndex("problem_progress_user_id_problem_id_key").on(
      t.userId,
      t.problemId
    ),
    problemIdx: index("problem_progress_problem_id_idx").on(t.problemId),
  })
);

export const submissionTestResults = pgTable(
  "submission_test_results",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    testCaseId: uuid("test_case_id").references(() => testCases.id, {
      onDelete: "set null",
    }),
    status: text("status").notNull(),
    actualOutput: text("actual_output"),
    expectedOutput: text("expected_output"),
    runtimeMs: integer("runtime_ms"),
    errorMessage: text("error_message"),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (t) => ({
    statusCheck: check(
      "submission_test_results_status_check",
      sql`${t.status} in (
        'accepted',
        'wrong_answer',
        'runtime_error',
        'time_limit_exceeded',
        'compile_error'
      )`
    ),
    submissionIdx: index("submission_test_results_submission_id_idx").on(
      t.submissionId
    ),
  })
);

/** One AI tutor thread per (user, problem). */
export const problemChatThreads = pgTable(
  "problem_chat_thread",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
    updatedAt: timestamptz("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    userProblemUnique: uniqueIndex("problem_chat_thread_user_problem_unique").on(
      t.userId,
      t.problemId
    ),
    userIdx: index("problem_chat_thread_user_id_idx").on(t.userId),
    problemIdx: index("problem_chat_thread_problem_id_idx").on(t.problemId),
  })
);

export const problemChatMessages = pgTable(
  "problem_chat_message",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    threadId: uuid("thread_id")
      .notNull()
      .references(() => problemChatThreads.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    content: text("content").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (t) => ({
    roleCheck: check(
      "problem_chat_message_role_check",
      sql`${t.role} in ('user', 'assistant', 'system')`
    ),
    threadCreatedIdx: index("problem_chat_message_thread_created_idx").on(
      t.threadId,
      t.createdAt
    ),
  })
);

/** Drizzle schema object passed to `drizzle({ schema })`. */
export const schema = {
  problems,
  tags,
  problemTags,
  problemExamples,
  testCases,
  starterCode,
  problemHints,
  problemSolutions,
  problemLearningNotes,
  submissions,
  problemWorkspaceCode,
  problemProgress,
  submissionTestResults,
  problemChatThreads,
  problemChatMessages,
};
