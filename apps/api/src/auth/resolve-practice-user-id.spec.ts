import type { IncomingHttpHeaders } from "node:http";
import { resolvePracticeUserId } from "./resolve-practice-user-id";
import { getSessionFromHeaders } from "./session-from-headers";

jest.mock("./session-from-headers", () => ({
  getSessionFromHeaders: jest.fn(),
}));

const getSessionFromHeadersMock = getSessionFromHeaders as jest.MockedFunction<
  typeof getSessionFromHeaders
>;

describe("resolvePracticeUserId", () => {
  const originalClerkSecret = process.env.CLERK_SECRET_KEY;

  afterEach(() => {
    jest.resetAllMocks();
    if (originalClerkSecret === undefined) {
      delete process.env.CLERK_SECRET_KEY;
    } else {
      process.env.CLERK_SECRET_KEY = originalClerkSecret;
    }
  });

  it("returns Better Auth user id when Clerk is not configured", async () => {
    delete process.env.CLERK_SECRET_KEY;
    getSessionFromHeadersMock.mockResolvedValue({
      session: { id: "s1", userId: "ba-user", expiresAt: new Date() },
      user: { id: "ba-user", email: "a@b.com", name: "A" },
    } as never);

    const id = await resolvePracticeUserId({
      authorization: "Bearer legacy",
    } as IncomingHttpHeaders);

    expect(id).toBe("ba-user");
  });

  it("returns null when neither Clerk nor session resolves", async () => {
    delete process.env.CLERK_SECRET_KEY;
    getSessionFromHeadersMock.mockResolvedValue(null);

    const id = await resolvePracticeUserId({} as IncomingHttpHeaders);

    expect(id).toBeNull();
  });
});
