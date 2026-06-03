"use client";

import { useEffect } from "react";
import { useAnswerStt } from "@/features/interview-player/hooks/use-answer-stt";
import { useRecordingTimer } from "@/features/interview-player/hooks/use-recording-timer";
import { Button } from "@repo/design-system/components/ui/button";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { cn } from "@repo/design-system/lib/utils";
import { Clock, Mic, MicOff } from "lucide-react";

function sttErrorMessage(
  code: ReturnType<typeof useAnswerStt>["errorCode"]
): string | null {
  if (!code) {
    return null;
  }
  if (code === "unsupported") {
    return "Speech recognition is not supported in this browser. Type your answer below.";
  }
  if (code === "not-allowed" || code === "service-not-allowed") {
    return "Microphone access was denied. Allow the mic in browser settings or type your answer.";
  }
  if (code === "no-speech") {
    return "No speech detected. Try again or type your answer.";
  }
  return "Could not transcribe speech. Try again or type your answer.";
}

type AnswerInputProps = {
  transcript: string;
  onTranscriptChange: (value: string) => void;
  onUsedVoice: () => void;
  onRecordStart: () => void;
  onRecordStop?: (durationSeconds: number) => void;
  onListeningChange?: (listening: boolean) => void;
  disabled?: boolean;
};

export function AnswerInput({
  transcript,
  onTranscriptChange,
  onUsedVoice,
  onRecordStart,
  onRecordStop,
  onListeningChange,
  disabled,
}: AnswerInputProps) {
  const timer = useRecordingTimer();

  const { isListening, isSupported, errorCode, start, stop } = useAnswerStt({
    onTranscript: onTranscriptChange,
    onClear: () => onTranscriptChange(""),
  });

  useEffect(() => {
    onListeningChange?.(isListening);
  }, [isListening, onListeningChange]);

  const handleStart = () => {
    onRecordStart();
    onUsedVoice();
    timer.reset();
    timer.start();
    start();
  };

  const handleStop = () => {
    stop();
    timer.stop();
    onRecordStop?.(timer.seconds);
  };

  const errorMessage = sttErrorMessage(errorCode);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-foreground text-sm">Your answer</p>
        {isListening ? (
          <span className="flex items-center gap-1.5 font-mono text-destructive text-xs">
            <span className="size-2 animate-pulse rounded-full bg-destructive" />
            Recording
            <Clock className="size-3" />
            {timer.label}
          </span>
        ) : null}
      </div>

      {errorMessage ? (
        <p
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-900 text-sm dark:text-amber-100"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      {!isSupported && !errorMessage ? (
        <p className="text-muted-foreground text-sm">
          Voice input is unavailable in this browser. Type your answer below.
        </p>
      ) : null}

      <Textarea
        className={cn(
          "min-h-[160px] resize-y text-sm leading-relaxed",
          isListening && "ring-2 ring-destructive/40"
        )}
        disabled={disabled}
        onChange={(event) => onTranscriptChange(event.target.value)}
        placeholder="Type your answer or press Record and speak…"
        value={transcript}
      />

      <div className="flex flex-wrap gap-2">
        {isListening ? (
          <Button
            className="rounded-2xl"
            disabled={disabled}
            onClick={handleStop}
            type="button"
            variant="outline"
          >
            <MicOff className="mr-2 size-4" />
            Stop recording
          </Button>
        ) : (
          <Button
            className="rounded-2xl"
            disabled={disabled || !isSupported}
            onClick={handleStart}
            type="button"
          >
            <Mic className="mr-2 size-4" />
            Record
          </Button>
        )}
      </div>
    </div>
  );
}
