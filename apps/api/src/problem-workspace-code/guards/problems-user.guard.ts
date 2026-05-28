import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { IncomingHttpHeaders } from "node:http";
import { getSessionFromHeaders } from "../../auth/session-from-headers";

export type RequestWithUserId = {
  headers: IncomingHttpHeaders;
  userId?: string;
};

/**
 * Resolves the practice user id from a Better Auth session (session cookie or
 * `Authorization: Bearer` token from the bearer plugin).
 */
@Injectable()
export class ProblemsUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithUserId>();
    const headers = request.headers ?? {};

    const session = await getSessionFromHeaders(headers);

    if (session?.user?.id) {
      request.userId = session.user.id;
      return true;
    }

    throw new UnauthorizedException(
      "Sign in to the API (Bearer token or session cookie)."
    );
  }
}
