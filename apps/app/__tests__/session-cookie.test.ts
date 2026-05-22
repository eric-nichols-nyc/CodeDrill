import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { hasApiAuthTokenCookie } from "@/lib/auth/session-cookie";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/token";

function mockRequest(cookies: { name: string; value: string }[]): NextRequest {
  return {
    cookies: {
      getAll: () => cookies,
      get: (name: string) => cookies.find((c) => c.name === name),
    },
  } as unknown as NextRequest;
}

describe("hasApiAuthTokenCookie", () => {
  it("returns true when the auth token cookie is present", () => {
    expect(
      hasApiAuthTokenCookie(
        mockRequest([{ name: AUTH_TOKEN_COOKIE, value: "abc" }])
      )
    ).toBe(true);
  });

  it("returns false when token cookie is missing or empty", () => {
    expect(hasApiAuthTokenCookie(mockRequest([]))).toBe(false);
    expect(
      hasApiAuthTokenCookie(
        mockRequest([{ name: AUTH_TOKEN_COOKIE, value: "" }])
      )
    ).toBe(false);
  });
});
