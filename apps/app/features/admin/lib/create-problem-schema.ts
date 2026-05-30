import { z } from "zod";

export const difficultySchema = z.enum(["easy", "medium", "hard"]);

const publicImagePathSchema = z
  .string()
  .max(500)
  .optional()
  .refine(
    (value) =>
      value === undefined ||
      value.trim() === "" ||
      (value.startsWith("/") && !value.startsWith("//")),
    {
      message:
        "Image path must start with / (public folder, e.g. /images/examples/diagram.png)",
    }
  );

export const problemExampleSchema = z.object({
  input: z.string().min(1).max(50_000),
  output: z.string().min(1).max(50_000),
  explanation: z.string().max(50_000).optional(),
  imageUrl: publicImagePathSchema,
  imageAlt: z.string().max(500).optional(),
  sortOrder: z.number().int().optional(),
});

export const problemStarterCodeSchema = z.object({
  language: z.string().min(1).max(50),
  code: z.string().min(1).max(100_000),
  functionName: z.string().max(200).optional(),
});

export const problemHintSchema = z.object({
  title: z.string().max(200).optional(),
  body: z.string().min(1).max(50_000),
  sortOrder: z.number().int().optional(),
});

export const problemSolutionSchema = z.object({
  language: z.string().min(1).max(50),
  code: z.string().min(1).max(100_000),
  explanation: z.string().max(50_000).optional(),
  timeComplexity: z.string().max(200).optional(),
  spaceComplexity: z.string().max(200).optional(),
});

export const problemTestCaseSchema = z.object({
  input: z.string().min(1).max(50_000),
  expectedOutput: z.string().min(1).max(50_000),
  isSample: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const editorialYoutubeEmbedSchema = z.object({
  type: z.literal("youtube"),
  videoId: z.string().max(32),
});

export const problemEditorialSchema = z.object({
  title: z.string().max(500).optional(),
  content: z.string().max(50_000),
  embeds: z.array(editorialYoutubeEmbedSchema),
});

export const createProblemBodySchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(200),
  difficulty: difficultySchema,
  description: z.string().min(1),
  constraints: z.string().max(50_000).optional(),
  isPublished: z.boolean().optional(),
  patternSlug: z.string().max(200).optional(),
  loopStructure: z.string().max(200).optional(),
  skillFocus: z.string().max(200).optional(),
  tutorLevel: z.string().max(200).optional(),
  visualizationNotes: z.string().max(50_000).optional(),
  editorial: problemEditorialSchema.optional(),
  tags: z.array(z.string().min(1).max(100)).optional(),
  examples: z.array(problemExampleSchema).optional(),
  starterCode: z.array(problemStarterCodeSchema).min(1),
  hints: z.array(problemHintSchema).optional(),
  solutions: z.array(problemSolutionSchema).optional(),
  testCases: z.array(problemTestCaseSchema).optional(),
});

export type CreateProblemBody = z.infer<typeof createProblemBodySchema>;
