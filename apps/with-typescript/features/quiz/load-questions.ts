import { readFile } from "node:fs/promises";
import path from "node:path";
import type { QuizQuestion } from "./types";

const questionsPath = path.join(
  process.cwd(),
  "features",
  "quiz",
  "data",
  "questions.json"
);

const isQuizQuestion = (value: unknown): value is QuizQuestion => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<QuizQuestion>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.category === "string" &&
    typeof candidate.difficulty === "string" &&
    typeof candidate.question === "string" &&
    Array.isArray(candidate.options) &&
    candidate.options.every((option) => typeof option === "string") &&
    typeof candidate.correctOptionIndex === "number" &&
    (candidate.explanation === undefined ||
      typeof candidate.explanation === "string") &&
    (candidate.codeSample === undefined || typeof candidate.codeSample === "string")
  );
};

export const loadQuizQuestions = async (): Promise<QuizQuestion[]> => {
  const fileContent = await readFile(questionsPath, "utf8");
  const parsed: unknown = JSON.parse(fileContent);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(isQuizQuestion);
};
