import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import {
  ProblemsUserGuard,
  type RequestWithUserId,
} from "./problem-workspace-code/guards/problems-user.guard";

/**
 * Canonical session check for `apps/api`.
 *
 * Access: Clerk Bearer JWT (resolved by `ProblemsUserGuard`). The richer profile
 * row (`GET /api/me`) is served by `apps/nest-clerk-api`; this only echoes identity.
 */
@Controller()
export class SessionController {
  @Get("me")
  @UseGuards(ProblemsUserGuard)
  getMe(@Req() request: RequestWithUserId) {
    return { userId: request.userId };
  }
}
