import { BadRequestException } from "@nestjs/common";
import type { Request } from "express";

export type RawBodyRequest = Request & { rawBody?: Buffer };

/**
 * Clerk `verifyWebhook` expects a Web Fetch `Request`, not Express `req`.
 */
export function toClerkWebhookRequest(req: RawBodyRequest): globalThis.Request {
  const rawBody = req.rawBody;
  if (!rawBody?.length) {
    throw new BadRequestException(
      "Missing raw body for webhook verification. Ensure Nest bootstrap uses { rawBody: true }."
    );
  }

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const part of value) {
        headers.append(key, part);
      }
    } else {
      headers.set(key, value);
    }
  }

  const host = req.get("host") ?? "localhost";
  const url = `${req.protocol}://${host}${req.originalUrl}`;

  return new globalThis.Request(url, {
    method: req.method,
    headers,
    body: new Uint8Array(rawBody),
  });
}
