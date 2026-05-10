/**
 * =============================================================================
 * SECURITY LAB: Rate Limiting Demo API
 * =============================================================================
 *
 * This endpoint demonstrates rate limiting in action. Try hitting it rapidly
 * to see rate limiting kick in.
 *
 * TEST IT:
 * --------
 * # Hit the endpoint multiple times rapidly
 * for i in {1..15}; do curl -s http://localhost:3005/api/rate-limit-demo | jq; done
 *
 * # You'll see successful responses, then 429 errors after the limit
 *
 * REAL-WORLD USE CASES:
 * ---------------------------------------------------------------------------
 *
 * 1. LOGIN ENDPOINTS
 *    Limit: 5-10 attempts per minute per IP
 *    Why: Prevents brute force password attacks
 *    Example: After 5 failed logins, require CAPTCHA or temporary lockout
 *
 * 2. PASSWORD RESET
 *    Limit: 3-5 requests per hour per email
 *    Why: Prevents email bombing and enumeration
 *    Example: Attacker can't spam password reset to discover valid emails
 *
 * 3. SIGNUP/REGISTRATION
 *    Limit: 3-5 per hour per IP
 *    Why: Prevents mass account creation (spam, fraud)
 *    Example: Bot can't create 10,000 accounts for spam campaigns
 *
 * 4. SEARCH/AUTOCOMPLETE
 *    Limit: 30-60 per minute per user
 *    Why: Prevents data harvesting and excessive database load
 *    Example: Competitor can't scrape your entire product catalog
 *
 * 5. FILE UPLOADS
 *    Limit: 10-20 per hour per user
 *    Why: Prevents storage abuse and DoS
 *    Example: User can't fill up your S3 bucket with garbage
 *
 * 6. AI/ML ENDPOINTS
 *    Limit: Based on cost per request
 *    Why: AI APIs are expensive — one runaway script could cost thousands
 *    Example: GPT-4 costs ~$0.03/request — 100k requests = $3,000
 *
 * 7. PAYMENT/CHECKOUT
 *    Limit: 5-10 per minute per user
 *    Why: Prevents card testing fraud (testing stolen cards)
 *    Example: Fraudster can't test 1000 stolen card numbers per minute
 *
 * 8. PUBLIC APIs
 *    Limit: Tiered by API key/plan
 *    Why: Fair usage, monetization, protection
 *    Example: Free tier = 100/day, Pro = 10,000/day, Enterprise = unlimited
 */

import { apiLimiter, authLimiter } from "@/lib/rate-limit";

/**
 * Helper to extract client IP address.
 *
 * IMPORTANT SECURITY NOTE:
 * -------------------------
 * x-forwarded-for can be spoofed by clients! Only trust it when:
 * 1. Your app is behind a trusted reverse proxy (Vercel, Cloudflare, nginx)
 * 2. The proxy is configured to set/override this header
 *
 * In production, consider:
 * - Vercel: request.headers.get('x-real-ip')
 * - Cloudflare: request.headers.get('cf-connecting-ip')
 * - AWS: The rightmost IP in x-forwarded-for chain
 */
function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
    // The leftmost is the original client (but can be spoofed)
    // In production behind trusted proxy, use rightmost or x-real-ip
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return "unknown";
}

export async function GET(request: Request) {
  const ip = getClientIP(request);

  /**
   * Rate limit check
   * -----------------
   * We allow 10 requests per minute per IP.
   * If exceeded, we return 429 Too Many Requests.
   *
   * The check() promise:
   * - Resolves (success) if under the limit
   * - Rejects (throws) if over the limit
   */
  try {
    await apiLimiter.check(10, ip); // 10 requests per minute per IP
  } catch {
    /**
     * 429 Too Many Requests
     * ----------------------
     * Standard HTTP status code for rate limiting.
     *
     * Best practices for 429 responses:
     * 1. Include Retry-After header (seconds until they can retry)
     * 2. Don't reveal exact limits (helps attackers optimize)
     * 3. Log the attempt for monitoring/alerting
     */
    return Response.json(
      {
        error: "Too many requests",
        message: "Please slow down and try again later",
        // Optionally include retry-after hint
        retryAfter: 60,
      },
      {
        status: 429,
        headers: {
          "Retry-After": "60", // Standard header: wait 60 seconds
        },
      }
    );
  }

  // Request allowed — process normally
  return Response.json({
    success: true,
    message: "Request processed successfully",
    ip,
    timestamp: new Date().toISOString(),
    hint: "Try hitting this endpoint rapidly to see rate limiting in action!",
  });
}

/**
 * POST example with stricter limits (for sensitive operations)
 */
export async function POST(request: Request) {
  const ip = getClientIP(request);

  // Use stricter limiter for POST operations
  try {
    await authLimiter.check(5, ip); // Only 5 POST requests per minute
  } catch {
    return Response.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const body = await request.json().catch(() => ({}));

  return Response.json({
    success: true,
    message: "POST request processed",
    received: body,
    note: "POST endpoints typically have stricter rate limits than GET",
  });
}
