/**
 * =============================================================================
 * SECURITY LAB: CSRF (Cross-Site Request Forgery) Protection
 * =============================================================================
 *
 * KEY INTERVIEW TALKING POINTS:
 *
 * WHAT IS CSRF?
 * ---------------------------------------------------------------------------
 * CSRF is an attack where a malicious website tricks a user's browser into
 * making unwanted requests to a site where the user is authenticated.
 *
 * The attack exploits the fact that browsers automatically attach cookies
 * to requests — including requests initiated by other sites.
 *
 * EXAMPLE ATTACK SCENARIO:
 * ---------------------------------------------------------------------------
 * 1. User logs into bank.com (gets session cookie)
 * 2. User visits evil.com (in another tab, still logged into bank)
 * 3. evil.com contains:
 *    <form action="https://bank.com/transfer" method="POST">
 *      <input name="to" value="attacker">
 *      <input name="amount" value="10000">
 *    </form>
 *    <script>document.forms[0].submit()</script>
 *
 * 4. Browser sends the POST with the user's bank.com cookies attached
 * 5. Bank processes the transfer thinking it's legitimate
 *
 * WHY sameSite COOKIES AREN'T ALWAYS ENOUGH:
 * ---------------------------------------------------------------------------
 * - sameSite: 'lax' blocks cross-site POST requests (good!)
 * - BUT it allows GET requests and top-level navigations
 * - Some legacy browsers don't support sameSite
 * - Defense in depth: multiple layers are better than one
 *
 * CSRF TOKEN PATTERNS:
 * ---------------------------------------------------------------------------
 *
 * 1. SYNCHRONIZER TOKEN PATTERN (this implementation)
 *    - Server generates random token, stores in session
 *    - Token embedded in form as hidden field
 *    - Server validates token matches session on submit
 *    ✅ Most secure, works everywhere
 *    ⚠️ Requires server-side session storage
 *
 * 2. DOUBLE-SUBMIT COOKIE PATTERN
 *    - Token stored in cookie AND sent in request body/header
 *    - Server verifies both match
 *    ✅ Stateless (no server storage needed)
 *    ⚠️ Vulnerable if attacker can set cookies (subdomain attacks)
 *
 * 3. CUSTOM REQUEST HEADER
 *    - Require custom header like X-Requested-With: XMLHttpRequest
 *    - Browsers block cross-origin requests from setting custom headers
 *    ✅ Simple for AJAX-only APIs
 *    ⚠️ Doesn't work for form submissions
 */

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const CSRF_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "csrf-secret-change-in-production"
);
const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_TOKEN_EXPIRY = "1h"; // Tokens expire after 1 hour

/**
 * Generate a CSRF token
 *
 * We use a signed JWT as the token because:
 * - It's tamper-proof (attacker can't forge it)
 * - It can include expiration
 * - It can be verified without database lookup
 * - It's cryptographically random
 */
export async function generateCSRFToken(): Promise<string> {
  const token = await new SignJWT({
    type: "csrf",
    // Include random bytes to ensure uniqueness
    nonce: crypto.randomUUID(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(CSRF_TOKEN_EXPIRY)
    .sign(CSRF_SECRET);

  return token;
}

/**
 * Verify a CSRF token
 *
 * Returns true if the token is valid and not expired.
 * Returns false for any invalid, expired, or missing token.
 */
export async function verifyCSRFToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, CSRF_SECRET);
    return true;
  } catch {
    // Token is invalid, expired, or tampered with
    return false;
  }
}

/**
 * Set CSRF token in a cookie and return it for form embedding
 *
 * The Double-Submit pattern:
 * - Token goes in both a cookie AND the form
 * - Attacker can't read our cookies (same-origin policy)
 * - So they can't include the token in their forged form
 */
export async function setCSRFCookie(): Promise<string> {
  const token = await generateCSRFToken();

  (await cookies()).set(CSRF_COOKIE_NAME, token, {
    httpOnly: true, // Prevent XSS from stealing token
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Extra protection: only send on same-site requests
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return token;
}

/**
 * Get CSRF token from cookie
 */
export async function getCSRFFromCookie(): Promise<string | undefined> {
  return (await cookies()).get(CSRF_COOKIE_NAME)?.value;
}

/**
 * Validate CSRF token from request against cookie
 *
 * This is the Double-Submit Cookie validation:
 * 1. Get token from cookie (set by our server)
 * 2. Get token from request body/header (submitted by form)
 * 3. Verify both exist and are valid
 * 4. Verify they match (double-submit check)
 */
export async function validateCSRFRequest(
  submittedToken: string | null
): Promise<{ valid: boolean; error?: string }> {
  // Check if token was submitted
  if (!submittedToken) {
    return { valid: false, error: "CSRF token missing from request" };
  }

  // Get token from cookie
  const cookieToken = await getCSRFFromCookie();
  if (!cookieToken) {
    return { valid: false, error: "CSRF cookie missing" };
  }

  // Verify the submitted token is valid (not expired/tampered)
  const isValidToken = await verifyCSRFToken(submittedToken);
  if (!isValidToken) {
    return { valid: false, error: "CSRF token invalid or expired" };
  }

  // Double-submit check: tokens must match
  // This prevents an attacker who somehow got a valid token from using it
  // without also having access to set our cookie
  if (submittedToken !== cookieToken) {
    return { valid: false, error: "CSRF token mismatch" };
  }

  return { valid: true };
}
