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

export type RequestWithUserId = {
  headers: IncomingHttpHeaders;
  userId?: string;
};

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
 * Resolves the practice user id from either:
 * - Better Auth session cookie, or
 * - `x-internal-problems-secret` + `x-user-id` (Next.js BFF with Neon Auth).
 */
@Injectable()
export class ProblemsUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithUserId>();
    const headers = request.headers ?? {};

    const configured = process.env.INTERNAL_PROBLEMS_SECRET?.trim();
    const headerSecret = headerValue(headers, "x-internal-problems-secret");
    const headerUserId = headerValue(headers, "x-user-id")?.trim();

    if (
      configured &&
      headerSecret &&
      headerUserId &&
      timingSafeStringEqual(headerSecret, configured)
    ) {
      request.userId = headerUserId;
      return true;
    }

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });

    if (session?.user?.id) {
      request.userId = session.user.id;
      return true;
    }

    throw new UnauthorizedException(
      "Sign in to save workspace code, or use the app BFF with a valid session."
    );
  }
}
