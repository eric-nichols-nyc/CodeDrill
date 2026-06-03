"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  completeInterviewSessionAction,
  startInterviewSessionAction,
  submitAnswerAction,
} from "@/features/interview-player/actions";
import { AnswerInput } from "@/features/interview-player/components/answer-input";
import { FeedbackPlaceholder } from "@/features/interview-player/components/feedback-placeholder";
import { InterviewNavigation } from "@/features/interview-player/components/interview-navigation";
import { ProgressIndicator } from "@/features/interview-player/components/progress-indicator";
import { QuestionCard } from "@/features/interview-player/components/question-card";
import { useQuestionTts } from "@/features/interview-player/hooks/use-question-tts";
import type { AnswerMode, InterviewSession } from "@/features/interview-player/types";

const MIN_TRANSCRIPT_LENGTH = 10;

type PlayerStep = "answer" | "feedback";

type InterviewPlayerProps = {
  initialSession: InterviewSession;
};

export function InterviewPlayer({ initialSession }: InterviewPlayerProps) {
  const router = useRouter();
  const [session, setSession] = useState(initialSession);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [step, setStep] = useState<PlayerStep>("answer");
  const [transcript, setTranscript] = useState("");
  const [usedVoice, setUsedVoice] = useState(false);
  const [recordDurationSeconds, setRecordDurationSeconds] = useState<
    number | undefined
  >(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { speak, stop, isSpeaking, isSupported } = useQuestionTts();

  const question = session.questions[questionIndex];
  const isLastQuestion = questionIndex >= session.questions.length - 1;

  useEffect(() => {
    if (session.status !== "ready") {
      return;
    }
    void startInterviewSessionAction(session.id).then((result) => {
      if (result.ok) {
        setSession(result.data);
      }
    });
  }, [session.id, session.status]);

  useEffect(() => {
    const q = session.questions[questionIndex];
    if (!q) {
      return;
    }
    setTranscript(q.answer?.transcript ?? "");
    setUsedVoice(q.answer?.answerMode === "voice");
    setRecordDurationSeconds(undefined);
    setStep("answer");
    // Only when navigating between questions — not when session refreshes after submit.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- questionIndex is intentional sole dep
  }, [questionIndex]);

  useEffect(() => {
    if (session.status === "completed") {
      router.replace(`/interviews/${session.id}/complete`);
    }
  }, [session.status, session.id, router]);

  if (!question) {
    return (
      <p className="text-muted-foreground text-sm">No questions in this session.</p>
    );
  }

  const handleRecordStart = () => {
    stop();
  };

  const handleSubmit = async () => {
    const trimmed = transcript.trim();
    if (trimmed.length < MIN_TRANSCRIPT_LENGTH) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const answerMode: AnswerMode = usedVoice ? "voice" : "text";
    const result = await submitAnswerAction(session.id, question.id, {
      transcript: trimmed,
      answerMode,
      durationSeconds: recordDurationSeconds,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSession(result.data);
    setStep("feedback");
  };

  const handleNextFromFeedback = async () => {
    if (!isLastQuestion) {
      setQuestionIndex((index) => index + 1);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const result = await completeInterviewSessionAction(session.id);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(`/interviews/${session.id}/complete`);
  };

  const handlePrevious = () => {
    if (questionIndex <= 0) {
      return;
    }
    setQuestionIndex((index) => index - 1);
  };

  const trimmedLength = transcript.trim().length;

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-background">
      <ProgressIndicator
        currentOrder={question.order}
        interviewTitle={session.interviewTitle}
        jobSubtitle={
          session.jobContext.companyName && session.jobContext.roleTitle
            ? `${session.jobContext.roleTitle} at ${session.jobContext.companyName}`
            : session.jobContext.roleSummary || undefined
        }
        questionCount={session.questionCount}
      />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8">
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}

        <QuestionCard
          isSpeaking={isSpeaking}
          listenDisabled={isRecording || step === "feedback"}
          onListen={() => speak(question.question)}
          onStopListen={stop}
          question={question}
          ttsSupported={isSupported}
        />

        {step === "answer" ? (
          <>
            <AnswerInput
              disabled={isSubmitting}
              onListeningChange={setIsRecording}
              onRecordStart={handleRecordStart}
              onRecordStop={setRecordDurationSeconds}
              onTranscriptChange={setTranscript}
              onUsedVoice={() => setUsedVoice(true)}
              transcript={transcript}
            />

            <InterviewNavigation
              canGoPrevious={questionIndex > 0}
              isSubmitting={isSubmitting}
              onPrevious={handlePrevious}
              onSubmit={() => void handleSubmit()}
              showSubmit
              submitDisabled={trimmedLength < MIN_TRANSCRIPT_LENGTH}
            />
          </>
        ) : (
          <FeedbackPlaceholder
            isLastQuestion={isLastQuestion}
            onNext={() => void handleNextFromFeedback()}
          />
        )}
      </main>
    </div>
  );
}
