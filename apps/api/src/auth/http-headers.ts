import type { IncomingHttpHeaders } from "node:http";

/** First header value for a case-insensitive name. */
export function headerValue(
  headers: IncomingHttpHeaders | Record<string, string | string[] | undefined>,
  name: string
): string | undefined {
  const key = Object.keys(headers).find(
    (k) => k.toLowerCase() === name.toLowerCase()
  );
  const raw = key ? headers[key as keyof typeof headers] : undefined;
  if (raw === undefined) {
    return;
  }
  return Array.isArray(raw) ? raw[0] : raw;
}
