"use server";

import {
  InterviewApiError,
  interviewApiFetch,
} from "@/lib/interview-api/server";
import type { JobAnalysis, JobAnalysisPayload } from "@/lib/interview-api/types";

export type JobAnalysisActionResult<T> =
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

export type GenerateJobAnalysisInput = {
  jobDescription: string;
  jobUrl?: string;
  companyName?: string;
  roleTitle?: string;
};

function buildGenerateBody(input: GenerateJobAnalysisInput) {
  const body: Record<string, string> = {
    jobDescription: input.jobDescription.trim(),
  };
  const jobUrl = input.jobUrl?.trim();
  const companyName = input.companyName?.trim();
  const roleTitle = input.roleTitle?.trim();
  if (jobUrl) {
    body.jobUrl = jobUrl;
  }
  if (companyName) {
    body.companyName = companyName;
  }
  if (roleTitle) {
    body.roleTitle = roleTitle;
  }
  return body;
}

export async function generateJobAnalysisAction(
  input: GenerateJobAnalysisInput
): Promise<JobAnalysisActionResult<JobAnalysisPayload>> {
  try {
    const data = await interviewApiFetch<JobAnalysisPayload>(
      "/interview/job-analyses/generate",
      {
        method: "POST",
        body: JSON.stringify(buildGenerateBody(input)),
      }
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function saveJobAnalysisAction(
  jobDescription: string,
  payload: JobAnalysisPayload,
  jobUrl?: string
): Promise<JobAnalysisActionResult<JobAnalysis>> {
  try {
    const body: Record<string, unknown> = {
      jobDescription: jobDescription.trim(),
      ...payload,
    };
    const trimmedUrl = jobUrl?.trim();
    if (trimmedUrl) {
      body.jobUrl = trimmedUrl;
    }
    const data = await interviewApiFetch<JobAnalysis>("/interview/job-analyses", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function getLatestJobAnalysisAction(): Promise<
  JobAnalysisActionResult<JobAnalysis | null>
> {
  try {
    const data = await interviewApiFetch<JobAnalysis | null>(
      "/interview/job-analyses/me"
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}
