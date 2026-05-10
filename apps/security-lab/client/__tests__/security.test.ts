import { describe, expect, it } from "vitest";

/**
 * Basic security utility tests
 */

describe("Security Utilities", () => {
  describe("Input Sanitization", () => {
    it("should detect potential XSS in script tags", () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const containsScript =
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      expect(containsScript.test(maliciousInput)).toBe(true);
    });

    it("should detect javascript: protocol in URLs", () => {
      const maliciousUrl = "javascript:alert('xss')";
      const isJavascriptProtocol = /^javascript:/i.test(maliciousUrl);
      expect(isJavascriptProtocol).toBe(true);
    });

    it("should allow safe URLs", () => {
      const safeUrls = [
        "https://example.com",
        "http://localhost:3000",
        "/api/data",
        "./relative/path",
      ];

      for (const url of safeUrls) {
        const isJavascriptProtocol = /^javascript:/i.test(url);
        expect(isJavascriptProtocol).toBe(false);
      }
    });
  });

  describe("Email Validation", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    it("accepts valid email formats", () => {
      const validEmails = [
        "user@example.com",
        "test.user@domain.org",
        "name+tag@company.co.uk",
      ];

      for (const email of validEmails) {
        expect(emailRegex.test(email)).toBe(true);
      }
    });

    it("rejects invalid email formats", () => {
      const invalidEmails = [
        "notanemail",
        "@nodomain.com",
        "spaces in@email.com",
        "missing@domain",
      ];

      for (const email of invalidEmails) {
        expect(emailRegex.test(email)).toBe(false);
      }
    });
  });

  describe("CSRF Token Format", () => {
    it("validates token format (base64url-like)", () => {
      // CSRF tokens should be URL-safe base64
      const validToken = "abc123_-XYZ";
      const base64urlRegex = /^[A-Za-z0-9_-]+$/;
      expect(base64urlRegex.test(validToken)).toBe(true);
    });

    it("rejects tokens with invalid characters", () => {
      const invalidToken = "token with spaces!@#";
      const base64urlRegex = /^[A-Za-z0-9_-]+$/;
      expect(base64urlRegex.test(invalidToken)).toBe(false);
    });
  });
});
