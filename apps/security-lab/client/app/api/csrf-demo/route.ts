/**
 * =============================================================================
 * SECURITY LAB: CSRF Protection Demo API
 * =============================================================================
 *
 * This endpoint demonstrates CSRF token validation for state-changing operations.
 *
 * THE ATTACK WE'RE PREVENTING:
 * ---------------------------------------------------------------------------
 * Without CSRF protection, an attacker could create a page like:
 *
 *   <html>
 *     <body onload="document.forms[0].submit()">
 *       <form action="http://localhost:3005/api/csrf-demo" method="POST">
 *         <input name="action" value="delete_account">
 *       </form>
 *     </body>
 *   </html>
 *
 * If a logged-in user visits this page, their browser would:
 * 1. Submit the form to your server
 * 2. Automatically include their session cookies
 * 3. Your server would process it as a legitimate request
 *
 * WITH CSRF protection:
 * - The attacker's form can't include the CSRF token
 * - They can't read our cookies (same-origin policy blocks this)
 * - The request is rejected with 403 Forbidden
 *
 * TEST THIS:
 * ---------------------------------------------------------------------------
 *
 * Step 1: Get a CSRF token
 *   curl http://localhost:3005/api/csrf-demo -c cookies.txt
 *
 * Step 2: Submit with valid token (succeeds)
 *   TOKEN=$(cat cookies.txt | grep csrf_token | awk '{print $7}')
 *   curl -X POST http://localhost:3005/api/csrf-demo \
 *     -H "Content-Type: application/json" \
 *     -b cookies.txt \
 *     -d "{\"csrf_token\":\"$TOKEN\",\"action\":\"transfer\",\"amount\":100}"
 *
 * Step 3: Submit without token (fails - simulates CSRF attack)
 *   curl -X POST http://localhost:3005/api/csrf-demo \
 *     -H "Content-Type: application/json" \
 *     -b cookies.txt \
 *     -d '{"action":"transfer","amount":100}'
 *
 * Step 4: Submit with wrong token (fails)
 *   curl -X POST http://localhost:3005/api/csrf-demo \
 *     -H "Content-Type: application/json" \
 *     -b cookies.txt \
 *     -d '{"csrf_token":"fake-token","action":"transfer","amount":100}'
 */

import { setCSRFCookie, validateCSRFRequest } from "@/lib/csrf";

/**
 * GET /api/csrf-demo
 *
 * Returns a CSRF token for use in forms.
 * In a real app, this would be embedded in your HTML forms.
 *
 * This simulates what happens when a user loads a page with a form:
 * - Server generates a fresh CSRF token
 * - Token is set in a cookie (for double-submit validation)
 * - Token is also returned to be embedded in the form
 */
export async function GET() {
  const token = await setCSRFCookie();

  return Response.json({
    message: "CSRF token generated",
    csrf_token: token,
    usage: {
      step1: "Include this token in your form as a hidden field",
      step2: 'Or send it in the request body as "csrf_token"',
      step3: 'Or send it in a header as "X-CSRF-Token"',
      note: "The token must match the one in your cookie",
    },
    example_form: `
      <form action="/api/csrf-demo" method="POST">
        <input type="hidden" name="csrf_token" value="${token}">
        <input type="text" name="action" placeholder="Action">
        <button type="submit">Submit</button>
      </form>
    `,
  });
}

/**
 * POST /api/csrf-demo
 *
 * Protected endpoint that requires a valid CSRF token.
 * This represents any state-changing operation:
 * - Money transfers
 * - Password changes
 * - Account deletion
 * - Settings updates
 * - Any action that modifies data
 */
export async function POST(request: Request) {
  /**
   * STEP 1: Extract CSRF token from request
   *
   * The token can come from:
   * - Request body (form submission or JSON)
   * - Custom header (AJAX requests)
   *
   * We check both locations for flexibility.
   */
  let submittedToken: string | null = null;

  // Check header first (preferred for AJAX)
  const headerToken = request.headers.get("X-CSRF-Token");
  if (headerToken) {
    submittedToken = headerToken;
  }

  // Parse body and check for token there too
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
    if (!submittedToken && typeof body.csrf_token === "string") {
      submittedToken = body.csrf_token;
    }
  } catch {
    // Body might not be JSON, that's okay
  }

  /**
   * STEP 2: Validate the CSRF token
   *
   * This checks:
   * - Token was provided
   * - Token is cryptographically valid (not forged)
   * - Token hasn't expired
   * - Token matches the one in the cookie (double-submit)
   */
  const validation = await validateCSRFRequest(submittedToken);

  if (!validation.valid) {
    /**
     * CSRF VALIDATION FAILED
     *
     * This could mean:
     * 1. Legitimate user's token expired → they need to refresh the page
     * 2. CSRF attack in progress → we just blocked it!
     * 3. Bug in the frontend → token not being sent
     *
     * We return 403 Forbidden (not 401 Unauthorized):
     * - 401 = "who are you?" (authentication)
     * - 403 = "I know who you are, but you can't do this" (authorization/CSRF)
     */
    return Response.json(
      {
        error: "CSRF validation failed",
        reason: validation.error,
        hint: "Refresh the page to get a new CSRF token",
        /**
         * SECURITY NOTE:
         * In production, you might not want to reveal the specific reason
         * to avoid giving attackers information. A generic "Request rejected"
         * is often sufficient.
         */
      },
      { status: 403 }
    );
  }

  /**
   * STEP 3: CSRF validation passed — process the request
   *
   * At this point we know:
   * ✅ Request came from our own site (has valid token)
   * ✅ User has a valid session (has the cookie)
   * ✅ Token hasn't been tampered with
   *
   * We can safely process the state-changing operation.
   */

  // Example: Process a "transfer" action
  const action = body.action || "unknown";
  const amount = body.amount || 0;

  return Response.json({
    success: true,
    message: "Request processed successfully",
    action,
    amount,
    security: {
      csrf_validated: true,
      note: "This request was protected against CSRF attacks",
    },
  });
}

/**
 * =============================================================================
 * REAL-WORLD IMPLEMENTATION NOTES
 * =============================================================================
 *
 * 1. WHEN TO USE CSRF PROTECTION
 *    - All state-changing operations (POST, PUT, DELETE, PATCH)
 *    - Form submissions
 *    - Any action that modifies user data or settings
 *    - NOT needed for GET requests (they should be idempotent)
 *
 * 2. FRAMEWORK INTEGRATION
 *    - Most frameworks (Django, Rails, Laravel) have built-in CSRF
 *    - Next.js doesn't have built-in CSRF — you need to add it
 *    - Libraries like 'csrf' or 'csurf' can help
 *
 * 3. SPA CONSIDERATIONS
 *    - For SPAs, the custom header approach works well
 *    - Generate token on login, store in memory (not localStorage!)
 *    - Send token in X-CSRF-Token header with every request
 *
 * 4. TOKEN ROTATION
 *    - Some apps rotate tokens after each request (most secure)
 *    - Others use one token per session (simpler)
 *    - Always rotate tokens after login/logout
 *
 * 5. COMBINING WITH OTHER DEFENSES
 *    - Use sameSite cookies (you already do!)
 *    - Check Origin/Referer headers (you already do in proxy.ts!)
 *    - CSRF tokens are an additional layer
 */
