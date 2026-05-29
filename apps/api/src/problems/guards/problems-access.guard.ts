import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";
import type { IncomingHttpHeaders } from "node:http";
import { headerValue } from "../../auth/http-headers";
import { resolvePracticeUserId } from "../../auth/resolve-practice-user-id";

function timingSafeStringEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) {
    return false;
  }
  return timingSafeEqual(ba, bb);
}

/**
 * Allows `/problems` when either:
 * - `INTERNAL_PROBLEMS_SECRET` is set and `x-internal-problems-secret` matches
 *   (server-to-server catalog/admin BFF — not end-user identity), or
 * - A valid Clerk JWT is present.
 */
@Injectable()
export class ProblemsAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: IncomingHttpHeaders }>();
    const headers = request.headers ?? {};

    const configured = process.env.INTERNAL_PROBLEMS_SECRET?.trim();
    const headerSecret = headerValue(headers, "x-internal-problems-secret");

    if (configured && headerSecret && timingSafeStringEqual(headerSecret, configured)) {
      return true;
    }

    const userId = await resolvePracticeUserId(headers);

    if (userId) {
      return true;
    }

    throw new UnauthorizedException(
      "Sign in to the API (Clerk Bearer token) or use x-internal-problems-secret for server-to-server catalog access."
    );
  }
}
