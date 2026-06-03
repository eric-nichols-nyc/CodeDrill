"use server";

import {
  InterviewApiError,
  interviewApiFetch,
} from "@/lib/interview-api/server";
import type {
  AnswerMode,
  CreateInterviewSessionInput,
  InterviewBlueprintPreview,
  InterviewSession,
  SeedInterviewResult,
} from "@/lib/interview-api/types";

export type InterviewPlayerActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function toErrorMessage(error: unknown): string {
  if (error instanceof InterviewApiError) {
    if (error.status === 401) {
      return "Sign in to continue.";
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong.";
}

export async function generateInterviewBlueprintAction(): Promise<
  InterviewPlayerActionResult<InterviewBlueprintPreview>
> {
  try {
    const data = await interviewApiFetch<InterviewBlueprintPreview>(
      "/interview/sessions/generate",
      { method: "POST", body: JSON.stringify({}) }
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function createInterviewSessionAction(
  input: CreateInterviewSessionInput
): Promise<InterviewPlayerActionResult<SeedInterviewResult>> {
  try {
    const data = await interviewApiFetch<SeedInterviewResult>(
      "/interview/sessions",
      { method: "POST", body: JSON.stringify(input) }
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function seedInterviewSessionAction(): Promise<
  InterviewPlayerActionResult<SeedInterviewResult>
> {
  try {
    const data = await interviewApiFetch<SeedInterviewResult>(
      "/interview/sessions/seed",
      { method: "POST" }
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function getInterviewSessionAction(
  interviewId: string
): Promise<InterviewPlayerActionResult<InterviewSession>> {
  try {
    const data = await interviewApiFetch<InterviewSession>(
      `/interview/sessions/${interviewId}`
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function startInterviewSessionAction(
  interviewId: string
): Promise<InterviewPlayerActionResult<InterviewSession>> {
  try {
    const data = await interviewApiFetch<InterviewSession>(
      `/interview/sessions/${interviewId}/start`,
      { method: "POST" }
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export type SubmitAnswerInput = {
  transcript: string;
  answerMode: AnswerMode;
  durationSeconds?: number;
};

export async function submitAnswerAction(
  interviewId: string,
  questionId: string,
  input: SubmitAnswerInput
): Promise<InterviewPlayerActionResult<InterviewSession>> {
  try {
    const data = await interviewApiFetch<InterviewSession>(
      `/interview/sessions/${interviewId}/questions/${questionId}/answer`,
      {
        method: "POST",
        body: JSON.stringify(input),
      }
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function completeInterviewSessionAction(
  interviewId: string
): Promise<InterviewPlayerActionResult<InterviewSession>> {
  try {
    const data = await interviewApiFetch<InterviewSession>(
      `/interview/sessions/${interviewId}/complete`,
      { method: "POST" }
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}
