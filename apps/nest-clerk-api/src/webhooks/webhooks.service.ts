import { Injectable, Logger } from "@nestjs/common";
import type { UserJSON, WebhookEvent } from "@clerk/backend";
// biome-ignore lint/style/useImportType: Nest constructor injection
import { ClerkService } from "../auth/clerk.service";
// biome-ignore lint/style/useImportType: Nest constructor injection
import { UsersService } from "../users/users.service";

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly clerkService: ClerkService;
  private readonly usersService: UsersService;

  constructor(clerkService: ClerkService, usersService: UsersService) {
    this.clerkService = clerkService;
    this.usersService = usersService;
  }

  async handleClerkEvent(evt: WebhookEvent): Promise<{ ok: true; synced: boolean }> {
    switch (evt.type) {
      case "user.created":
      case "user.updated":
        await this.syncUser(evt.data);
        this.logger.log(`Synced user (${evt.type}): ${evt.data.id}`);
        return { ok: true, synced: true };

      case "session.created": {
        const user = evt.data.user;
        if (user) {
          await this.syncUser(user);
          this.logger.log(`Synced user (session.created): ${user.id}`);
          return { ok: true, synced: true };
        }
        return { ok: true, synced: false };
      }

      case "user.deleted": {
        const deleted = await this.usersService.deleteByClerkId(evt.data.id ?? "");
        this.logger.log(`Deleted user (user.deleted): ${evt.data.id}, found=${deleted}`);
        return { ok: true, synced: deleted };
      }

      default:
        this.logger.debug(`Ignored Clerk webhook event: ${evt.type}`);
        return { ok: true, synced: false };
    }
  }

  private async syncUser(data: UserJSON): Promise<void> {
    const clerkUserId = data.id;
    let email =
      data.email_addresses?.find((e) => e.id === data.primary_email_address_id)
        ?.email_address ??
      data.email_addresses?.[0]?.email_address ??
      null;

    if (!email) {
      email = await this.fetchEmailFromClerk(clerkUserId);
    }

    await this.usersService.upsertFromClerkProfile({
      clerkUserId,
      email,
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      imageUrl: data.image_url ?? null,
    });
  }

  private async fetchEmailFromClerk(clerkUserId: string): Promise<string | null> {
    try {
      const user = await this.clerkService.client.users.getUser(clerkUserId);
      return user.primaryEmailAddress?.emailAddress ?? null;
    } catch (error) {
      this.logger.warn(
        `Could not enrich email for ${clerkUserId}: ${error instanceof Error ? error.message : String(error)}`
      );
      return null;
    }
  }
}
