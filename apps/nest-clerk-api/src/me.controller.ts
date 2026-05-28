import { Controller, Get } from "@nestjs/common";
import { CurrentUserId } from "./auth/current-user.decorator";
// biome-ignore lint/style/useImportType: Nest constructor injection
import { ClerkService } from "./auth/clerk.service";

@Controller()
export class MeController {
  private readonly clerkService: ClerkService;

  constructor(clerkService: ClerkService) {
    this.clerkService = clerkService;
  }

  @Get("me")
  async getMe(@CurrentUserId() userId: string) {
    const user = await this.clerkService.client.users.getUser(userId);
    return {
      userId: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
