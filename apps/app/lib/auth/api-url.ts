import { keys } from "./keys";

const TRAILING_SLASH = /\/$/;

/** Nest practice API origin (no trailing slash). */
export function apiBaseUrl(): string {
  const fromEnv = keys().NEON_JWT_API_URL;
  return (fromEnv ?? "http://localhost:3030").replace(TRAILING_SLASH, "");
}
