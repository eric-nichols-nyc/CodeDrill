import { keys } from "./keys";

const TRAILING_SLASH = /\/$/;

/** `nest-clerk-api` origin (no trailing slash). */
export function nestClerkApiBaseUrl(): string {
  const fromEnv = keys().NEST_CLERK_API_URL;
  return (fromEnv ?? "http://localhost:3031").replace(TRAILING_SLASH, "");
}
