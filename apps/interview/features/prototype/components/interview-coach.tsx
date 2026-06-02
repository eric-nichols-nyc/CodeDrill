"use client";

import { ScreenCreateInterview } from "@/features/prototype/components/screen-create-interview";
import { ScreenFeedback } from "@/features/prototype/components/screen-feedback";
import { ScreenFinalReport } from "@/features/prototype/components/screen-final-report";
import { ScreenGenerating } from "@/features/prototype/components/screen-generating";
import { ScreenOverview } from "@/features/prototype/components/screen-overview";
import { ScreenQuestion } from "@/features/prototype/components/screen-question";
import { mockQuestions } from "@/features/prototype/data/mock-data";
import { useCallback, useState } from "react";

const SCREEN = {
  CREATE: "create",
  GENERATING: "generating",
  OVERVIEW: "overview",
  QUESTION: "question",
  FEEDBACK: "feedback",
  REPORT: "report",
} as const;

type Screen = (typeof SCREEN)[keyof typeof SCREEN];

export function InterviewCoach() {
  const [screen, setScreen] = useState<Screen>(SCREEN.CREATE);
  const [questionIndex, setQuestionIndex] = useState(0);

  const isLastQuestion = questionIndex >= mockQuestions.length - 1;

  const handleSubmitAnswer = () => {
    setScreen(SCREEN.FEEDBACK);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setScreen(SCREEN.REPORT);
    } else {
      setQuestionIndex((index) => index + 1);
      setScreen(SCREEN.QUESTION);
    }
  };

  const handleRetake = () => {
    setQuestionIndex(0);
    setScreen(SCREEN.CREATE);
  };

  const handleGeneratingComplete = useCallback(() => {
    setScreen(SCREEN.OVERVIEW);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {screen === SCREEN.CREATE && (
        <ScreenCreateInterview onNext={() => setScreen(SCREEN.GENERATING)} />
      )}
      {screen === SCREEN.GENERATING && (
        <ScreenGenerating onComplete={handleGeneratingComplete} />
      )}
      {screen === SCREEN.OVERVIEW && (
        <ScreenOverview onNext={() => setScreen(SCREEN.QUESTION)} />
      )}
      {screen === SCREEN.QUESTION && (
        <ScreenQuestion
          key={questionIndex}
          onSubmit={handleSubmitAnswer}
          questionIndex={questionIndex}
        />
      )}
      {screen === SCREEN.FEEDBACK && (
        <ScreenFeedback
          isLast={isLastQuestion}
          onNext={handleNextQuestion}
          questionIndex={questionIndex}
        />
      )}
      {screen === SCREEN.REPORT && (
        <ScreenFinalReport onRetake={handleRetake} />
      )}
    </div>
  );
}
