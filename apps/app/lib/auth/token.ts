/** Cookie + localStorage key for the API Bearer token (bearer plugin). */
export const AUTH_TOKEN_COOKIE = "codedrill.auth_token";
export const AUTH_TOKEN_STORAGE_KEY = "codedrill.auth_token";

const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** Client-only — persist token after sign-in / sign-up. */
export function persistAuthToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; secure"
      : "";
  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}; samesite=lax${secure}`;
}

/** Client-only — clear token on sign-out. */
export function clearAuthToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0`;
}

/** Client-only — read token for Better Auth client fetchOptions. */
export function readAuthTokenFromStorage(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ?? "";
}
