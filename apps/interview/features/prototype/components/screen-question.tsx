"use client";

import { mockQuestions } from "@/features/prototype/data/mock-data";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Progress } from "@repo/design-system/components/ui/progress";
import { Mic, Square } from "lucide-react";
import { useState } from "react";

type ScreenQuestionProps = {
  questionIndex: number;
  onSubmit: () => void;
};

export function ScreenQuestion({ questionIndex, onSubmit }: ScreenQuestionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const question = mockQuestions[questionIndex];
  const progress = ((questionIndex + 1) / mockQuestions.length) * 100;

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
      return;
    }
    setIsRecording(true);
    setHasRecording(false);
  };

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="font-medium text-muted-foreground uppercase tracking-wide">
            Question {questionIndex + 1} of {mockQuestions.length}
          </p>
          <span className="text-muted-foreground">{question.topic}</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">{question.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleToggleRecording}
              type="button"
              variant={isRecording ? "destructive" : "secondary"}
            >
              {isRecording ? (
                <>
                  <Square className="size-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="size-4" />
                  {hasRecording ? "Re-record" : "Start Recording"}
                </>
              )}
            </Button>
            <Button disabled={!hasRecording} onClick={onSubmit} type="button">
              Submit Answer
            </Button>
          </div>
          {hasRecording ? (
            <p className="rounded-lg border bg-muted/40 p-4 text-muted-foreground text-sm">
              Mock transcript: I led a performance initiative on our dashboard.
              We measured LCP and reduced it by focusing on bundle splitting and
              image optimization...
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Answer out loud, then stop recording to review your transcript.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
