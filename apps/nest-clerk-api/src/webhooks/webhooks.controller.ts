import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  Req,
} from "@nestjs/common";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { getClerkWebhookSecret } from "../config/env";
import { Public } from "../auth/public.decorator";
import { toClerkWebhookRequest, type RawBodyRequest } from "./clerk-webhook-request";
// biome-ignore lint/style/useImportType: Nest constructor injection
import { WebhooksService } from "./webhooks.service";

@Public()
@Controller("webhooks")
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);
  private readonly webhooksService: WebhooksService;

  constructor(webhooksService: WebhooksService) {
    this.webhooksService = webhooksService;
  }

  @Post("clerk")
  async handleClerk(@Req() req: RawBodyRequest) {
    const signingSecret = getClerkWebhookSecret();
    if (!signingSecret) {
      throw new BadRequestException(
        "CLERK_WEBHOOK_SECRET or CLERK_WEBHOOK_SIGNING_SECRET is not configured"
      );
    }

    try {
      const event = await verifyWebhook(toClerkWebhookRequest(req), {
        signingSecret,
      });
      return this.webhooksService.handleClerkEvent(event);
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : String(error);
      this.logger.warn(`Clerk webhook verification failed: ${detail}`);
      throw new BadRequestException("Invalid Clerk webhook signature or payload");
    }
  }
}
