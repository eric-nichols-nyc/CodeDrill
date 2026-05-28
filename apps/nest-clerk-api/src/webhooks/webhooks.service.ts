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
        const clerkUser = evt.data.user;
        if (clerkUser) {
          await this.syncUser(clerkUser);
          this.logger.log(`Synced user (session.created): ${clerkUser.id}`);
          return { ok: true, synced: true };
        }
        return { ok: true, synced: false };
      }

      case "user.deleted": {
        const id = evt.data.id ?? "";
        const deleted = await this.usersService.deleteById(id);
        this.logger.log(`Deleted user (user.deleted): ${id}, found=${deleted}`);
        return { ok: true, synced: deleted };
      }

      default:
        this.logger.debug(`Ignored Clerk webhook event: ${evt.type}`);
        return { ok: true, synced: false };
    }
  }

  private async syncUser(data: UserJSON): Promise<void> {
    const id = data.id;
    const primaryEmail = data.email_addresses?.find(
      (e) => e.id === data.primary_email_address_id
    );

    let email: string | null =
      primaryEmail?.email_address ?? data.email_addresses?.[0]?.email_address ?? null;

    if (!email) {
      email = await this.fetchEmailFromClerk(id);
    }

    const emailVerified =
      primaryEmail?.verification?.status === "verified" ||
      data.email_addresses?.some((e) => e.verification?.status === "verified") ||
      false;

    await this.usersService.upsertFromClerkProfile({
      id,
      email,
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      imageUrl: data.image_url ?? null,
      emailVerified,
    });
  }

  private async fetchEmailFromClerk(id: string): Promise<string | null> {
    try {
      const clerkUser = await this.clerkService.client.users.getUser(id);
      return clerkUser.primaryEmailAddress?.emailAddress ?? null;
    } catch (error) {
      this.logger.warn(
        `Could not enrich email for ${id}: ${error instanceof Error ? error.message : String(error)}`
      );
      return null;
    }
  }
}
