import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";
import type { IncomingHttpHeaders } from "node:http";
import { getSessionFromHeaders } from "../../auth/session-from-headers";

function headerValue(
  headers: IncomingHttpHeaders | Record<string, string | string[] | undefined>,
  name: string
): string | undefined {
  const key = Object.keys(headers).find(
    (k) => k.toLowerCase() === name.toLowerCase()
  );
  const raw = key ? headers[key as keyof typeof headers] : undefined;
  if (raw === undefined) {
    return;
  }
  return Array.isArray(raw) ? raw[0] : raw;
}

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
 * - A valid Better Auth session is present (Bearer token or session cookie).
 *
 * Used with `@AllowAnonymous()` so the global guard skips this controller; this guard enforces access.
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

    const session = await getSessionFromHeaders(headers);

    if (session) {
      return true;
    }

    throw new UnauthorizedException(
      "Sign in to the API (Bearer token or session cookie) or use x-internal-problems-secret for server-to-server catalog access."
    );
  }
}
