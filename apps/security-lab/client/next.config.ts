/**
 * =============================================================================
 * SECURITY LAB: Security Headers Configuration
 * =============================================================================
 *
 * KEY INTERVIEW TALKING POINTS:
 *
 * Security headers are HTTP response headers that instruct browsers how to
 * behave when handling your site's content. They're a critical defense layer
 * that costs nothing to implement but prevents entire classes of attacks.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers() {
    return [
      {
        // Apply these headers to ALL routes
        source: "/:path*",
        headers: [
          /**
           * CONTENT-SECURITY-POLICY (CSP)
           * ---------------------------------------------------------------------
           * The most powerful security header. Controls which resources the
           * browser is allowed to load for your page.
           *
           * How it prevents XSS:
           * - Even if an attacker injects <script>alert('xss')</script>, the
           *   browser BLOCKS it because inline scripts aren't in the policy
           * - Attackers can't load scripts from evil.com because only 'self' is allowed
           *
           * Directive breakdown:
           * - default-src 'self'     → Only load resources from same origin by default
           * - script-src 'self'      → Only allow scripts from same origin
           *   'unsafe-inline'        → Required for Next.js in development
           *   'unsafe-eval'          → Required for Next.js hot reload in dev
           * - style-src 'self'       → Allow styles from same origin
           *   'unsafe-inline'        → Allow inline styles (needed for many CSS-in-JS)
           *                            ⚠️ Weaker than nonces, but often necessary
           * - img-src 'self' data: https: → Images from same origin, data URIs, or any HTTPS
           * - font-src 'self'        → Fonts only from same origin
           *
           * ⚠️ DEVELOPMENT vs PRODUCTION:
           * This CSP includes 'unsafe-inline' and 'unsafe-eval' for development.
           * In production, use nonces instead:
           *   script-src 'self' 'nonce-${nonce}'
           * Next.js can generate nonces - see: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
           *
           * Production tip: Use 'report-uri' or 'report-to' to log violations
           * without blocking, then tighten the policy based on real data.
           */
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self';",
          },

          /**
           * X-FRAME-OPTIONS
           * ---------------------------------------------------------------------
           * Prevents your site from being embedded in <iframe>, <frame>, <embed>, or <object>
           *
           * How it prevents clickjacking:
           * - Attacker creates a page with your site in an invisible iframe
           * - They overlay fake UI elements and trick users into clicking
           * - User thinks they're clicking attacker's button, but actually
           *   clicking a button on YOUR site (e.g., "Delete Account")
           *
           * Values:
           * - DENY              → Never allow framing (most secure)
           * - SAMEORIGIN        → Only allow framing by same origin
           * - ALLOW-FROM uri    → Only allow specific origin (deprecated)
           *
           * Modern alternative: Use CSP's frame-ancestors directive instead
           * Example: frame-ancestors 'none' (equivalent to DENY)
           */
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          /**
           * X-CONTENT-TYPE-OPTIONS
           * ---------------------------------------------------------------------
           * Prevents browsers from "MIME sniffing" — guessing the content type
           * based on file contents instead of trusting the Content-Type header.
           *
           * How it prevents attacks:
           * - Attacker uploads malicious.jpg that's actually JavaScript
           * - Without nosniff, browser might execute it as JavaScript
           * - With nosniff, browser strictly respects Content-Type header
           *
           * Always set to 'nosniff' — there's no downside.
           */
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          /**
           * REFERRER-POLICY
           * ---------------------------------------------------------------------
           * Controls how much referrer information is sent when navigating
           * from your site to another site.
           *
           * Why it matters:
           * - URLs can contain sensitive data (tokens, user IDs, search queries)
           * - Example: /reset-password?token=abc123 — you don't want that leaked
           *
           * Common values:
           * - no-referrer                    → Never send referrer (most private)
           * - same-origin                    → Only send to same origin
           * - strict-origin-when-cross-origin → Send origin (not full URL) to
           *                                     other sites, full URL to same origin
           *                                     ✅ Good balance of privacy & functionality
           * - no-referrer-when-downgrade     → Don't send when going HTTPS → HTTP
           */
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          /**
           * OTHER HEADERS TO CONSIDER:
           * ---------------------------------------------------------------------
           *
           * Strict-Transport-Security (HSTS):
           *   Forces HTTPS for all future requests. Add after you're confident
           *   HTTPS works everywhere.
           *   value: 'max-age=31536000; includeSubDomains; preload'
           *
           * Permissions-Policy (formerly Feature-Policy):
           *   Controls browser features like camera, microphone, geolocation.
           *   value: 'camera=(), microphone=(), geolocation=()'
           *
           * X-XSS-Protection:
           *   Legacy header, mostly superseded by CSP. Modern browsers have
           *   removed support. Not harmful to include, but not necessary.
           */
        ],
      },
    ];
  },
};

export default nextConfig;
