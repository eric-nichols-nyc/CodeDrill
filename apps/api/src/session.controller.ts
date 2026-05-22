import { Controller, Get } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

/**
 * Protected route (global AuthGuard from nestjs-better-auth).
 * Accepts session cookie or `Authorization: Bearer` (bearer plugin).
 */
@Controller()
export class SessionController {
  @Get("me")
  getMe(@Session() session: UserSession) {
    return { user: session.user, session: session.session };
  }
}
