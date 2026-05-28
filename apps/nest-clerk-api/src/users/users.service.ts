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

  async findById(id: string): Promise<UserRow> {
    const row = await this.databaseService.findUserById(id);
    if (!row) {
      throw new NotFoundException(
        "User is not provisioned yet. Wait for the Clerk webhook to sync, then retry."
      );
    }
    return row;
  }

  findByIdOptional(id: string): Promise<UserRow | undefined> {
    return this.databaseService.findUserById(id);
  }

  /** @deprecated Use findById — id is Clerk JWT sub */
  findByClerkId(clerkUserId: string): Promise<UserRow> {
    return this.findById(clerkUserId);
  }

  upsertFromClerkProfile(input: {
    id: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null;
    emailVerified?: boolean;
  }): Promise<UserRow> {
    return this.databaseService.upsertUser(input);
  }

  deleteById(id: string): Promise<boolean> {
    return this.databaseService.deleteUserById(id);
  }

  /** @deprecated Use deleteById */
  deleteByClerkId(clerkUserId: string): Promise<boolean> {
    return this.deleteById(clerkUserId);
  }
}
