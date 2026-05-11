import type { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { hasNeonAuthSessionCookie } from "@/lib/auth/session-cookie";

function mockRequest(cookies: { name: string; value: string }[]): NextRequest {
  return {
    cookies: {
      getAll: () => cookies,
    },
  } as unknown as NextRequest;
}

describe("hasNeonAuthSessionCookie", () => {
  it("returns true when a Neon session cookie is present", () => {
    expect(
      hasNeonAuthSessionCookie(
        mockRequest([
          { name: "__Secure-neon-auth.session_token", value: "abc" },
        ])
      )
    ).toBe(true);
  });

  it("returns false when no neon-auth session cookie", () => {
    expect(
      hasNeonAuthSessionCookie(
        mockRequest([{ name: "other", value: "x" }])
      )
    ).toBe(false);
  });
});
