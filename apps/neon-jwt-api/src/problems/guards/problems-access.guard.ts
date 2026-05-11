import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { fromNodeHeaders } from "better-auth/node";
import { timingSafeEqual } from "node:crypto";
import type { IncomingHttpHeaders } from "node:http";
import { auth } from "../../auth";

function headerValue(
  headers: IncomingHttpHeaders | Record<string, string | string[] | undefined>,
  name: string
): string | undefined {
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());
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
 * - `INTERNAL_PROBLEMS_SECRET` is set and `x-internal-problems-secret` matches (BFF / server-to-server), or
 * - A valid Better Auth session is present (browser cookie).
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

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });

    if (session) {
      return true;
    }

    throw new UnauthorizedException(
      "Sign in to the API (Better Auth session cookie) or configure INTERNAL_PROBLEMS_SECRET on the client BFF and server."
    );
  }
}
