import { Injectable, NotFoundException } from "@nestjs/common";
// biome-ignore lint/style/useImportType: Nest constructor injection
import { DatabaseService } from "../database/database.service";
import type { UserRow } from "../database/schema";

@Injectable()
export class UsersService {
  private readonly databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  async findByClerkId(clerkUserId: string): Promise<UserRow> {
    const user = await this.databaseService.findUserByClerkId(clerkUserId);
    if (!user) {
      throw new NotFoundException(
        "User is not provisioned yet. Wait for the Clerk webhook to sync, then retry."
      );
    }
    return user;
  }

  findByClerkIdOptional(clerkUserId: string): Promise<UserRow | undefined> {
    return this.databaseService.findUserByClerkId(clerkUserId);
  }

  upsertFromClerkProfile(input: {
    clerkUserId: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null;
  }): Promise<UserRow> {
    return this.databaseService.upsertUser(input);
  }

  deleteByClerkId(clerkUserId: string): Promise<boolean> {
    return this.databaseService.deleteUserByClerkId(clerkUserId);
  }
}
