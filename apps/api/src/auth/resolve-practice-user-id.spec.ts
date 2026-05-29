import { verifyToken } from "@clerk/backend";
import type { IncomingHttpHeaders } from "node:http";
import { resolvePracticeUserId } from "./resolve-practice-user-id";

jest.mock("@clerk/backend", () => ({
  verifyToken: jest.fn(),
}));

const verifyTokenMock = verifyToken as jest.MockedFunction<typeof verifyToken>;

describe("resolvePracticeUserId", () => {
  const originalClerkSecret = process.env.CLERK_SECRET_KEY;

  beforeEach(() => {
    process.env.CLERK_SECRET_KEY = "sk_test_123";
  });

  afterEach(() => {
    jest.resetAllMocks();
    if (originalClerkSecret === undefined) {
      delete process.env.CLERK_SECRET_KEY;
    } else {
      process.env.CLERK_SECRET_KEY = originalClerkSecret;
    }
  });

  it("returns the Clerk JWT sub for a valid Bearer token", async () => {
    verifyTokenMock.mockResolvedValue({ sub: "clerk-user" } as never);

    const id = await resolvePracticeUserId({
      authorization: "Bearer good-token",
    } as IncomingHttpHeaders);

    expect(id).toBe("clerk-user");
  });

  it("returns null when Clerk verification throws", async () => {
    verifyTokenMock.mockRejectedValue(new Error("invalid token"));

    const id = await resolvePracticeUserId({
      authorization: "Bearer bad-token",
    } as IncomingHttpHeaders);

    expect(id).toBeNull();
  });

  it("returns null when no Authorization header is present", async () => {
    const id = await resolvePracticeUserId({} as IncomingHttpHeaders);

    expect(id).toBeNull();
    expect(verifyTokenMock).not.toHaveBeenCalled();
  });

  it("returns null when CLERK_SECRET_KEY is not configured", async () => {
    delete process.env.CLERK_SECRET_KEY;

    const id = await resolvePracticeUserId({
      authorization: "Bearer good-token",
    } as IncomingHttpHeaders);

    expect(id).toBeNull();
    expect(verifyTokenMock).not.toHaveBeenCalled();
  });
});
