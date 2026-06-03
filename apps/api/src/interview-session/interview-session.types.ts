import type { InterviewAnswerMode, InterviewSessionStatus } from "../database/schema";

export type QuestionAnswerView = {
  answerMode: InterviewAnswerMode;
  transcript: string;
  durationSeconds: number | null;
  submittedAt: string;
};

export type InterviewQuestionView = {
  id: string;
  order: number;
  category: string;
  difficulty: string;
  question: string;
  expectedSignals: string[];
  answer: QuestionAnswerView | null;
};

export type InterviewJobContext = {
  companyName: string;
  roleTitle: string;
  roleSummary: string;
};

export type InterviewSessionView = {
  id: string;
  interviewTitle: string;
  estimatedDurationMinutes: number;
  questionCount: number;
  categories: string[];
  status: InterviewSessionStatus;
  startedAt: string | null;
  completedAt: string | null;
  profileId: string;
  jobAnalysisId: string;
  jobContext: InterviewJobContext;
  questions: InterviewQuestionView[];
};

export type SeedSessionResult = {
  interviewId: string;
  interviewTitle: string;
  companyName: string;
  roleTitle: string;
};

export type InterviewBlueprintQuestionPreview = {
  order: number;
  category: string;
  difficulty: string;
  question: string;
  expectedSignals: string[];
  followUpOpportunities: string[];
};

/** Transient blueprint from POST /interview/sessions/generate */
export type InterviewBlueprintPreview = {
  profileId: string;
  jobAnalysisId: string;
  companyName: string;
  roleTitle: string;
  roleSummary: string;
  interviewTitle: string;
  estimatedDurationMinutes: number;
  questionCount: number;
  categories: string[];
  questions: InterviewBlueprintQuestionPreview[];
};
