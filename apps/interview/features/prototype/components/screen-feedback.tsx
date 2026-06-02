"use client";

import { mockFeedbackByQuestion } from "@/features/prototype/data/mock-data";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

type ScreenFeedbackProps = {
  questionIndex: number;
  onNext: () => void;
  isLast: boolean;
};

export function ScreenFeedback({
  questionIndex,
  onNext,
  isLast,
}: ScreenFeedbackProps) {
  const feedback = mockFeedbackByQuestion[questionIndex];

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Feedback · Question {questionIndex + 1}
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">Your coaching</h1>
        <p className="text-muted-foreground">
          Targeted feedback — not a generic chat reply.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Score: {feedback.score} / {feedback.maxScore}
          </CardTitle>
          <CardDescription>Based on your spoken answer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="mb-1 font-medium">Strengths</p>
            <ul className="list-inside list-disc text-muted-foreground">
              {feedback.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium">Weaknesses</p>
            <ul className="list-inside list-disc text-muted-foreground">
              {feedback.weaknesses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium">Suggested answer</p>
            <p className="text-muted-foreground">{feedback.suggestedAnswer}</p>
          </div>
          <div>
            <p className="mb-1 font-medium">Study topics</p>
            <p className="text-muted-foreground">
              {feedback.studyTopics.join(" · ")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full sm:w-auto" onClick={onNext} size="lg">
        {isLast ? "View Final Report" : "Next Question"}
      </Button>
    </section>
  );
}
