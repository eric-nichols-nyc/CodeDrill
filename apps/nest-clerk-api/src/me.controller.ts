import { Controller, Get } from "@nestjs/common";
import { CurrentUserId } from "./auth/current-user.decorator";
// biome-ignore lint/style/useImportType: Nest constructor injection
import { UsersService } from "./users/users.service";

@Controller()
export class MeController {
  private readonly usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @Get("me")
  async getMe(@CurrentUserId() userId: string) {
    const row = await this.usersService.findById(userId);
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified,
      image: row.image,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
