import { describe, expect, it } from "vitest";
import { transferSchema, validateTransfer } from "../lib/validation";

describe("transferSchema", () => {
  describe("recipient validation", () => {
    it("accepts valid email addresses", () => {
      const result = transferSchema.safeParse({
        recipient: "user@example.com",
        amount: "100",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email addresses", () => {
      const result = transferSchema.safeParse({
        recipient: "not-an-email",
        amount: "100",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.recipient).toBeDefined();
      }
    });

    it("rejects empty recipient", () => {
      const result = transferSchema.safeParse({
        recipient: "",
        amount: "100",
      });
      expect(result.success).toBe(false);
    });

    it("rejects emails exceeding max length", () => {
      const longEmail = `${"a".repeat(250)}@example.com`;
      const result = transferSchema.safeParse({
        recipient: longEmail,
        amount: "100",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("amount validation", () => {
    it("accepts valid amounts", () => {
      const result = transferSchema.safeParse({
        recipient: "user@example.com",
        amount: "500.50",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.amount).toBe(500.5);
      }
    });

    it("transforms string amount to number", () => {
      const result = transferSchema.safeParse({
        recipient: "user@example.com",
        amount: "123.45",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.amount).toBe("number");
        expect(result.data.amount).toBe(123.45);
      }
    });

    it("rejects zero amount", () => {
      const result = transferSchema.safeParse({
        recipient: "user@example.com",
        amount: "0",
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative amounts", () => {
      const result = transferSchema.safeParse({
        recipient: "user@example.com",
        amount: "-50",
      });
      expect(result.success).toBe(false);
    });

    it("rejects amounts over $10,000", () => {
      const result = transferSchema.safeParse({
        recipient: "user@example.com",
        amount: "10001",
      });
      expect(result.success).toBe(false);
    });

    it("accepts exactly $10,000", () => {
      const result = transferSchema.safeParse({
        recipient: "user@example.com",
        amount: "10000",
      });
      expect(result.success).toBe(true);
    });

    it("rejects non-numeric amounts", () => {
      const result = transferSchema.safeParse({
        recipient: "user@example.com",
        amount: "abc",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty amount", () => {
      const result = transferSchema.safeParse({
        recipient: "user@example.com",
        amount: "",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("validateTransfer helper", () => {
  it("returns success result for valid data", () => {
    const result = validateTransfer({
      recipient: "test@example.com",
      amount: "250",
    });
    expect(result.success).toBe(true);
  });

  it("returns error result for invalid data", () => {
    const result = validateTransfer({
      recipient: "invalid",
      amount: "-1",
    });
    expect(result.success).toBe(false);
  });
});
