"use client";

import { useState } from "react";
import { AnswerInput } from "@/features/interview-player/components/answer-input";
import { ProgressIndicator } from "@/features/interview-player/components/progress-indicator";
import { QuestionCard } from "@/features/interview-player/components/question-card";
import { useQuestionTts } from "@/features/interview-player/hooks/use-question-tts";
import type { PlayerSessionPreview } from "@/features/interview-player/types";
import { Badge } from "@repo/design-system/components/ui/badge";

type InterviewPlayerProps = {
  session: PlayerSessionPreview;
};

/**
 * Gate 1: voice flow (TTS question + STT answer). Submit/navigation in Gate 2.
 */
export function InterviewPlayer({ session }: InterviewPlayerProps) {
  const questionIndex = 0;
  const question = session.questions[questionIndex];
  const [transcript, setTranscript] = useState("");
  const [usedVoice, setUsedVoice] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const { speak, stop, isSpeaking, isSupported } = useQuestionTts();

  if (!question) {
    return (
      <p className="text-muted-foreground text-sm">No questions in this session.</p>
    );
  }

  const handleRecordStart = () => {
    stop();
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-background">
      <ProgressIndicator
        currentOrder={question.order}
        interviewTitle={session.interviewTitle}
        questionCount={session.questionCount}
      />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Gate 1 — voice demo</Badge>
          <span className="text-muted-foreground text-xs">
            Submit and multi-question navigation ship in Gate 2
          </span>
        </div>

        <QuestionCard
          isSpeaking={isSpeaking}
          listenDisabled={isRecording}
          onListen={() => speak(question.question)}
          onStopListen={stop}
          question={question}
          ttsSupported={isSupported}
        />

        <AnswerInput
          onListeningChange={setIsRecording}
          onRecordStart={handleRecordStart}
          onTranscriptChange={setTranscript}
          onUsedVoice={() => setUsedVoice(true)}
          transcript={transcript}
        />

        {transcript.trim().length > 0 ? (
          <p className="text-muted-foreground text-xs">
            Draft length: {transcript.trim().length} characters
            {usedVoice ? " · captured with microphone" : " · typed"}
          </p>
        ) : null}
      </main>
    </div>
  );
}
