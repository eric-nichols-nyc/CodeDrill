import { Injectable } from "@nestjs/common";
import { createClerkClient, verifyToken } from "@clerk/backend";

export type ClerkJwtPayload = Awaited<ReturnType<typeof verifyToken>>;

@Injectable()
export class ClerkService {
  private readonly secretKey = process.env.CLERK_SECRET_KEY;
  private readonly authorizedParties = (
    process.env.CLERK_AUTHORIZED_PARTIES ?? ""
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  get client() {
    if (!this.secretKey) {
      throw new Error(
        "CLERK_SECRET_KEY is not set. Add it to apps/nest-clerk-api/.env (Clerk Dashboard → API Keys)."
      );
    }
    return createClerkClient({ secretKey: this.secretKey });
  }

  async verifyBearerToken(
    authorizationHeader: string | undefined
  ): Promise<ClerkJwtPayload | null> {
    if (!this.secretKey) {
      throw new Error(
        "CLERK_SECRET_KEY is not set. Add it to apps/nest-clerk-api/.env (Clerk Dashboard → API Keys)."
      );
    }

    const token = authorizationHeader?.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return null;
    }

    try {
      return await verifyToken(token, {
        secretKey: this.secretKey,
        ...(this.authorizedParties.length > 0
          ? { authorizedParties: this.authorizedParties }
          : {}),
      });
    } catch {
      return null;
    }
  }
}
