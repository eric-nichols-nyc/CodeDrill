import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
// biome-ignore lint/style/useImportType: Nest constructor injection
import { ClerkService, type ClerkJwtPayload } from "./clerk.service";
import { IS_PUBLIC_KEY } from "./public.decorator";

export type AuthenticatedRequest = Request & {
  auth: ClerkJwtPayload;
  userId: string;
};

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly reflector: Reflector;
  private readonly clerkService: ClerkService;

  constructor(reflector: Reflector, clerkService: ClerkService) {
    this.reflector = reflector;
    this.clerkService = clerkService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const payload = await this.clerkService.verifyBearerToken(
      request.headers.authorization
    );

    if (!payload?.sub) {
      throw new UnauthorizedException("Missing or invalid Clerk session token");
    }

    request.auth = payload;
    request.userId = payload.sub;
    return true;
  }
}
