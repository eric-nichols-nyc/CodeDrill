"use client";

import { useSpeech } from "@/features/prototype/hooks/use-speech";
import { useTimer } from "@/features/prototype/hooks/use-timer";
import {
  mockInterview,
  mockQuestions,
} from "@/features/prototype/data/mock-data";
import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import {
  ChevronRight,
  Clock,
  Mic,
  MicOff,
  Send,
  Tag,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TYPING_SPEED_MS = 18;

type ScreenQuestionProps = {
  questionIndex: number;
  onSubmit: () => void;
};

export function ScreenQuestion({ questionIndex, onSubmit }: ScreenQuestionProps) {
  const question = mockQuestions[questionIndex];
  const total = mockInterview.totalQuestions;

  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isTranscriptTyping, setIsTranscriptTyping] = useState(false);
  const [typedQuestion, setTypedQuestion] = useState("");
  const [isQuestionTyping, setIsQuestionTyping] = useState(true);

  const timer = useTimer(isRecording);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const { speak, stop, isSpeaking, isSupported } = useSpeech();

  const progress = ((questionIndex + 1) / total) * 100;

  useEffect(() => {
    setTypedQuestion("");
    setIsQuestionTyping(true);
    setIsRecording(false);
    setHasRecorded(false);
    setTranscript("");
    setIsTranscriptTyping(false);
    stop();

    let index = 0;
    const full = question.question;
    const interval = window.setInterval(() => {
      index += 1;
      setTypedQuestion(full.slice(0, index));
      if (index >= full.length) {
        window.clearInterval(interval);
        setIsQuestionTyping(false);
      }
    }, TYPING_SPEED_MS);

    return () => window.clearInterval(interval);
  }, [question.question, questionIndex, stop]);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    let interval: ReturnType<typeof setInterval> | undefined;

    const delay = window.setTimeout(() => {
      const full = question.sampleTranscript;
      let index = 0;
      setIsTranscriptTyping(true);
      setTranscript("");

      interval = setInterval(() => {
        index += 1;
        setTranscript(full.slice(0, index));
        if (transcriptRef.current) {
          transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
        if (index >= full.length) {
          if (interval) {
            clearInterval(interval);
          }
          setIsTranscriptTyping(false);
        }
      }, TYPING_SPEED_MS);
    }, 800);

    return () => {
      window.clearTimeout(delay);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording, question.sampleTranscript]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setHasRecorded(false);
    setIsTranscriptTyping(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    setIsTranscriptTyping(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <span className="whitespace-nowrap font-medium text-muted-foreground text-xs">
              Question {questionIndex + 1} of {total}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="whitespace-nowrap font-semibold text-primary text-xs">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 font-mono font-semibold text-muted-foreground text-sm">
            <Clock className="size-3.5" />
            {timer}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-8">
        <div className="mb-4 self-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 font-semibold text-primary text-xs">
            <Tag className="size-3.5" />
            {question.topic}
          </span>
        </div>

        <div className="mb-6 w-full rounded-3xl border bg-card p-7 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
              <span className="font-bold text-primary-foreground text-xs">Q</span>
            </div>
            <p className="flex-1 font-semibold text-foreground text-lg leading-relaxed">
              {typedQuestion}
              {isQuestionTyping ? (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary align-middle" />
              ) : null}
            </p>
          </div>

          {isSupported && !isQuestionTyping ? (
            <div className="mt-4 flex items-center gap-2 border-t pt-4">
              <button
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold text-xs transition-all duration-200",
                  isSpeaking
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
                onClick={() =>
                  isSpeaking ? stop() : speak(question.question)
                }
                type="button"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="size-3.5" />
                    Stop Reading
                  </>
                ) : (
                  <>
                    <Volume2 className="size-3.5" />
                    Read Question Aloud
                  </>
                )}
              </button>
              {isSpeaking ? (
                <div className="flex h-4 items-end gap-0.5">
                  {[1, 2, 3, 4, 3].map((height, index) => (
                    <div
                      className="w-1 animate-bounce rounded-full bg-primary"
                      key={`wave-${index}`}
                      style={{
                        height: `${height * 4}px`,
                        animationDelay: `${index * 80}ms`,
                        animationDuration: "600ms",
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {!isRecording && !hasRecorded ? (
          <div className="w-full py-4 text-center">
            <p className="mb-6 text-muted-foreground text-sm">
              {isQuestionTyping
                ? "Question loading…"
                : "When you're ready, press Start Recording to begin your answer."}
            </p>
            <Button
              className="h-16 rounded-2xl px-10 text-base shadow-lg"
              disabled={isQuestionTyping}
              onClick={handleStartRecording}
              size="lg"
            >
              <Mic className="mr-2.5 size-5" />
              Start Recording
            </Button>
          </div>
        ) : null}

        {isRecording ? (
          <div className="flex w-full flex-col items-center gap-5">
            <div className="flex items-center gap-3 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2.5">
              <div className="size-2.5 animate-pulse rounded-full bg-destructive" />
              <span className="font-semibold text-destructive text-sm">
                Recording…
              </span>
              <span className="font-mono text-destructive text-sm">{timer}</span>
            </div>

            <div
              className="max-h-[220px] min-h-[140px] w-full overflow-y-auto rounded-2xl border bg-muted/40 p-5"
              ref={transcriptRef}
            >
              {transcript ? (
                <p className="text-foreground text-sm leading-relaxed">
                  {transcript}
                  {isTranscriptTyping ? (
                    <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary align-middle" />
                  ) : null}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  Transcribing your answer…
                </p>
              )}
            </div>

            <Button
              className="h-[52px] rounded-2xl border-destructive/30 px-8 text-destructive hover:bg-destructive/10"
              onClick={handleStopRecording}
              variant="outline"
            >
              <MicOff className="mr-2 size-4" />
              Stop Recording
            </Button>
          </div>
        ) : null}

        {hasRecorded ? (
          <div className="flex w-full flex-col gap-4">
            <div className="w-full rounded-2xl border bg-muted/40 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Volume2 className="size-4 text-muted-foreground" />
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Your Answer
                </p>
                <button
                  className="ml-auto font-medium text-primary text-xs hover:underline"
                  onClick={handleStartRecording}
                  type="button"
                >
                  Re-record
                </button>
              </div>
              <p className="text-foreground text-sm leading-relaxed">
                {transcript}
              </p>
            </div>

            <Button
              className="h-[52px] rounded-2xl text-base shadow-lg"
              onClick={onSubmit}
              size="lg"
            >
              <Send className="mr-2 size-4" />
              Submit Answer
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
