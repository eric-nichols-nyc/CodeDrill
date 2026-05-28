import "server-only";

import { auth } from "@clerk/nextjs/server";
import { nestClerkApiBaseUrl } from "./nest-clerk-url";

/** Bearer headers for `nest-clerk-api`. Returns null when unsigned. */
export async function nestClerkAuthHeaders(): Promise<Record<string, string> | null> {
  const token = await (await auth()).getToken();
  if (!token) {
    return null;
  }
  return { Authorization: `Bearer ${token}` };
}

/** Authenticated fetch to `nest-clerk-api` (path after `/api`, e.g. `me` → `/api/me`). */
export async function fetchNestClerkApi(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const headers = await nestClerkAuthHeaders();
  if (!headers) {
    throw new Error("Not authenticated");
  }

  const normalized = path.replace(/^\//, "");
  return fetch(`${nestClerkApiBaseUrl()}/api/${normalized}`, {
    ...init,
    headers: { ...headers, ...init?.headers },
    cache: init?.cache ?? "no-store",
  });
}

/** Profile row from `GET /api/me` (Better Auth `user` table, `id` = Clerk `sub`). */
export type NestClerkMe = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NestClerkMeResult =
  | { ok: true; data: NestClerkMe }
  | { ok: false; status: number; message: string };

/** Signed-in user's provisioned profile from `nest-clerk-api`. */
export async function getNestClerkMe(): Promise<NestClerkMeResult> {
  try {
    const res = await fetchNestClerkApi("me");
    if (!res.ok) {
      let message = res.statusText;
      try {
        const body = (await res.json()) as { message?: string };
        if (typeof body.message === "string") {
          message = body.message;
        }
      } catch {
        // non-JSON error body
      }
      return { ok: false, status: res.status, message };
    }
    const data = (await res.json()) as NestClerkMe;
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      message: error instanceof Error ? error.message : "Request failed",
    };
  }
}
