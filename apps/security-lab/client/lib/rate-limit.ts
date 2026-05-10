/**
 * =============================================================================
 * SECURITY LAB: Rate Limiting
 * =============================================================================
 *
 * KEY INTERVIEW TALKING POINTS:
 *
 * WHAT IS RATE LIMITING?
 * ---------------------------------------------------------------------------
 * Rate limiting restricts how many requests a client can make within a time
 * window. It's a fundamental security control that protects your application
 * from abuse and ensures fair resource usage.
 *
 * WHY IS RATE LIMITING ESSENTIAL FOR SECURITY?
 * ---------------------------------------------------------------------------
 *
 * 1. BRUTE FORCE PROTECTION
 *    - Without limits, attackers can try millions of password combinations
 *    - Rate limiting makes brute force attacks impractical
 *    - Example: 10 login attempts per minute = 14,400 tries per day max
 *              vs unlimited = billions per day with automation
 *
 * 2. DENIAL OF SERVICE (DoS) MITIGATION
 *    - Prevents a single client from overwhelming your server
 *    - Ensures resources remain available for legitimate users
 *    - Protects against both malicious attacks and accidental loops
 *
 * 3. API ABUSE PREVENTION
 *    - Stops scrapers from harvesting your data
 *    - Prevents competitors from mapping your entire API
 *    - Limits the blast radius if an API key is compromised
 *
 * 4. COST CONTROL
 *    - Prevents runaway costs from AI/ML APIs, databases, or third parties
 *    - A single bug or attack could rack up huge bills without limits
 *
 * 5. ENUMERATION ATTACK PREVENTION
 *    - Slows down user/email enumeration attacks
 *    - Makes it impractical to discover valid usernames or emails
 *
 * IMPLEMENTATION STRATEGIES:
 * ---------------------------------------------------------------------------
 *
 * 1. In-Memory (this example)
 *    ✅ Simple, no external dependencies
 *    ⚠️  Doesn't work across multiple server instances
 *    ⚠️  Resets on server restart
 *
 * 2. Redis-Based
 *    ✅ Works across multiple instances
 *    ✅ Persists across restarts
 *    ✅ Best for production distributed systems
 *
 * 3. Edge/CDN Level (Cloudflare, Vercel)
 *    ✅ Blocks bad traffic before it hits your server
 *    ✅ Zero latency cost to your application
 *    ✅ Best for DDoS protection
 */

import { LRUCache } from "lru-cache";

type RateLimitOptions = {
  /** Time window in milliseconds */
  interval: number;
  /** Maximum unique tokens (IPs/users) to track in the cache */
  uniqueTokenPerInterval: number;
};

/**
 * Creates a rate limiter using an LRU (Least Recently Used) cache.
 *
 * LRU is perfect for rate limiting because:
 * - Automatically evicts old entries when cache is full
 * - TTL (time-to-live) resets the count after the interval
 * - Memory-bounded — won't grow unbounded under attack
 */
export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, [number]>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60_000,
  });

  return {
    /**
     * Check if a token (usually IP or user ID) has exceeded the rate limit.
     *
     * @param limit - Maximum requests allowed in the time window
     * @param token - Unique identifier (IP address, user ID, API key)
     * @returns Promise that resolves if under limit, rejects if over limit
     */
    check: (limit: number, token: string): Promise<void> =>
      new Promise<void>((resolve, reject) => {
        let tokenCount: [number] | undefined = tokenCache.get(token);

        if (!tokenCount) {
          tokenCount = [0] as [number];
          tokenCache.set(token, tokenCount);
        }

        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        return isRateLimited ? reject() : resolve();
      }),
  };
}

/**
 * Pre-configured rate limiters for common use cases.
 * Different endpoints need different limits based on their risk profile.
 */

// Strict limit for authentication endpoints (brute force protection)
export const authLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

// Moderate limit for general API endpoints
export const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000,
});

// Very strict limit for sensitive operations (password reset, etc.)
export const sensitiveLimiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 100,
});
