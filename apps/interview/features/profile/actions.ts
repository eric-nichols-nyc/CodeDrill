"use server";

import {
  InterviewApiError,
  interviewApiFetch,
} from "@/lib/interview-api/server";
import type { CandidateProfile, ProfilePayload } from "@/lib/interview-api/types";

export type ProfileActionResult<T> =
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

export async function generateProfileAction(
  resumeText: string
): Promise<ProfileActionResult<ProfilePayload>> {
  try {
    const data = await interviewApiFetch<ProfilePayload>(
      "/interview/profiles/generate",
      {
        method: "POST",
        body: JSON.stringify({ resumeText }),
      }
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function saveProfileAction(
  resumeText: string,
  profile: ProfilePayload
): Promise<ProfileActionResult<CandidateProfile>> {
  try {
    const data = await interviewApiFetch<CandidateProfile>("/interview/profiles", {
      method: "POST",
      body: JSON.stringify({ resumeText, ...profile }),
    });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function getLatestProfileAction(): Promise<
  ProfileActionResult<CandidateProfile | null>
> {
  try {
    const data = await interviewApiFetch<CandidateProfile | null>(
      "/interview/profiles/me"
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}
