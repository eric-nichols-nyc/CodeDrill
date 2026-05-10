export type QuizDifficulty = "easy" | "medium" | "hard";

export type QuizCategory =
  | "fundamentals"
  | "safety"
  | "generics"
  | "advanced"
  | "architecture";

export type QuizQuestion = {
  id: number;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  codeSample?: string;
};
