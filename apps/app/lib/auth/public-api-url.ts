import { keys } from "./keys";

const TRAILING_SLASH = /\/$/;

/** Nest practice API origin for browser fetch (no trailing slash). */
export function publicApiBaseUrl(): string {
  const fromEnv = keys().NEXT_PUBLIC_NEON_JWT_API_URL;
  return (fromEnv ?? "http://localhost:3030").replace(TRAILING_SLASH, "");
}
