import { z } from "zod";

export const difficultySchema = z.enum(["easy", "medium", "hard"]);

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
});

export type CreateProblemBody = z.infer<typeof createProblemBodySchema>;
