import { Controller, Get } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

/**
 * Example protected route (global AuthGuard from nestjs-better-auth).
 * Send session cookie from sign-in, or call from a same-origin client with credentials.
 */
@Controller()
export class SessionController {
  @Get("me")
  getMe(@Session() session: UserSession) {
    return { user: session.user, session: session.session };
  }
}
