/** Gate 1+ player question shape (aligns with InterviewQuestion contract). */
export type PlayerQuestion = {
  id: string;
  order: number;
  category: string;
  difficulty: string;
  question: string;
  expectedSignals: string[];
};

export type PlayerSessionPreview = {
  interviewId: string;
  interviewTitle: string;
  questionCount: number;
  questions: PlayerQuestion[];
};
