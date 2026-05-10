import { describe, expect, it } from "vitest";
import {
  capitalize,
  formatCurrency,
  generateId,
  getInitials,
  isValidEmail,
  truncate,
} from "../lib/utils";

describe("formatCurrency", () => {
  it("formats USD currency correctly", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("handles negative numbers", () => {
    expect(formatCurrency(-50)).toBe("-$50.00");
  });

  it("rounds to 2 decimal places", () => {
    expect(formatCurrency(10.999)).toBe("$11.00");
  });
});

describe("truncate", () => {
  it("returns original string if shorter than max length", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates and adds ellipsis for long strings", () => {
    expect(truncate("hello world", 8)).toBe("hello...");
  });

  it("handles exact length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("handles empty string", () => {
    expect(truncate("", 10)).toBe("");
  });
});

describe("capitalize", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("handles already capitalized", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("handles single character", () => {
    expect(capitalize("a")).toBe("A");
  });
});

describe("getInitials", () => {
  it("returns initials for two-word name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("returns initials for single name", () => {
    expect(getInitials("John")).toBe("J");
  });

  it("limits to 2 initials for long names", () => {
    expect(getInitials("John William Doe")).toBe("JW");
  });

  it("handles lowercase names", () => {
    expect(getInitials("john doe")).toBe("JD");
  });
});

describe("isValidEmail", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("test.user@domain.org")).toBe(true);
    expect(isValidEmail("name+tag@company.co.uk")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("notanemail")).toBe(false);
    expect(isValidEmail("@nodomain.com")).toBe(false);
    expect(isValidEmail("missing@domain")).toBe(false);
    expect(isValidEmail("spaces in@email.com")).toBe(false);
  });
});

describe("generateId", () => {
  it("generates a string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
  });

  it("generates unique values", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });

  it("generates IDs of expected length", () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(5);
  });
});
