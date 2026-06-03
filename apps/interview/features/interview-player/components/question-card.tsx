"use client";

import type { PlayerQuestion } from "@/features/interview-player/types";
import { Button } from "@repo/design-system/components/ui/button";
import { Tag, Volume2, VolumeX } from "lucide-react";

type QuestionCardProps = {
  question: PlayerQuestion;
  listenDisabled?: boolean;
  ttsSupported: boolean;
  isSpeaking: boolean;
  onListen: () => void;
  onStopListen: () => void;
};

export function QuestionCard({
  question,
  listenDisabled,
  ttsSupported,
  isSpeaking,
  onListen,
  onStopListen,
}: QuestionCardProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 font-semibold text-primary text-xs">
          <Tag className="size-3.5" />
          {question.category}
        </span>
        <span className="rounded-full bg-muted px-3 py-1.5 font-medium text-muted-foreground text-xs">
          {question.difficulty}
        </span>
      </div>

      <div className="rounded-3xl border bg-card p-7 shadow-sm">
        <p className="font-semibold text-foreground text-lg leading-relaxed">
          {question.question}
        </p>

        {ttsSupported ? (
          <div className="mt-4 flex items-center gap-2 border-t pt-4">
            <Button
              className="rounded-full"
              disabled={listenDisabled}
              onClick={() => (isSpeaking ? onStopListen() : onListen())}
              size="sm"
              type="button"
              variant={isSpeaking ? "default" : "secondary"}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="mr-1.5 size-3.5" />
                  Stop question
                </>
              ) : (
                <>
                  <Volume2 className="mr-1.5 size-3.5" />
                  Listen to question
                </>
              )}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-dashed bg-muted/30 p-4">
        <p className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          What to cover
        </p>
        <p className="mb-3 text-muted-foreground text-xs">
          Practice targets for a strong answer. Scoring comes after you submit.
        </p>
        <ul className="list-inside list-disc space-y-1 text-foreground text-sm">
          {question.expectedSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
