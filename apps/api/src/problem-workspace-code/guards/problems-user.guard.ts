import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { IncomingHttpHeaders } from "node:http";
import { resolvePracticeUserId } from "../../auth/resolve-practice-user-id";

export type RequestWithUserId = {
  headers: IncomingHttpHeaders;
  userId?: string;
};

/**
 * Resolves the practice user id from Clerk JWT (`sub`) or Better Auth session
 * (Bearer token / session cookie).
 */
@Injectable()
export class ProblemsUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithUserId>();
    const headers = request.headers ?? {};

    const userId = await resolvePracticeUserId(headers);

    if (userId) {
      request.userId = userId;
      return true;
    }

    throw new UnauthorizedException(
      "Sign in to the API (Clerk Bearer token or Better Auth session)."
    );
  }
}
