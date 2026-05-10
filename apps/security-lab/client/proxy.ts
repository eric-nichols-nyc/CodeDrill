/**
 * =============================================================================
 * SECURITY LAB: Proxy - CORS Protection & Authorization
 * =============================================================================
 *
 * In Next.js 16, middleware.ts was renamed to proxy.ts.
 * This file handles both CORS protection and user authentication/authorization.
 *
 * KEY INTERVIEW TALKING POINTS:
 *
 * WHAT IS PROXY/MIDDLEWARE?
 * ---------------------------------------------------------------------------
 * The proxy runs BEFORE your route handlers, allowing you to:
 * - Authenticate requests
 * - Authorize access to routes
 * - Handle CORS (Cross-Origin Resource Sharing)
 * - Add custom headers
 * - Redirect users
 * - Log requests
 *
 * WHY COMBINE CORS AND AUTH IN PROXY?
 * ---------------------------------------------------------------------------
 * Next.js only supports ONE proxy file. It makes sense to handle:
 * - CORS (network boundary concerns) - blocks unauthorized origins
 * - Authentication (security concerns) - verifies user identity
 * Both run early in the request pipeline, before routes execute
 *
 * IMPORTANT: CORS is NOT a substitute for authentication!
 * ---------------------------------------------------------------------------
 * - CORS only affects BROWSER requests (curl/Postman bypass it)
 * - CORS prevents cross-origin reading, but doesn't authenticate users
 * - Always authenticate and authorize requests on the server side
 *
 * PROXY VS API ROUTE AUTH:
 * ---------------------------------------------------------------------------
 * Proxy (this file):
 *   ✅ Runs for ALL matching routes
 *   ✅ Can protect entire route patterns
 *   ✅ Runs before route handlers
 *   ✅ Can redirect/rewrite requests
 *   ⚠️ Limited to Edge Runtime (no Node.js APIs)
 *
 * API Route auth (in route.ts):
 *   ✅ Full Node.js API access
 *   ✅ Can access database, file system, etc.
 *   ✅ Fine-grained control per route
 *   ⚠️ Must duplicate logic across routes
 *
 * BEST PRACTICE: Use BOTH
 * - Proxy: CORS checks, quick JWT validation, route protection
 * - API Routes: Detailed authorization, role checks, business logic
 */

import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

/**
 * =============================================================================
 * CORS CONFIGURATION
 * =============================================================================
 *
 * Define allowed origins for Cross-Origin Resource Sharing.
 * Only requests from these origins will be allowed to access your API.
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3008", // Update to match your dev server port
  "https://your-production-domain.com",
];

/**
 * JWT Secret - MUST match the one used for signing in login route
 * In production, use environment variables stored securely
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

/**
 * User information extracted from JWT token
 * This type matches what's stored in the JWT payload
 */
export interface AuthenticatedUser {
  email: string;
  role: string;
}

/**
 * Extract user information from request headers
 * Proxy sets these headers when a valid JWT is found
 *
 * Usage in API routes:
 *   const user = getUserFromHeaders(request.headers);
 *   if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
 */
export function getUserFromHeaders(headers: Headers): AuthenticatedUser | null {
  const email = headers.get("x-user-email");
  const role = headers.get("x-user-role");

  if (!(email && role)) {
    return null;
  }

  return { email, role };
}

/**
 * Handle CORS preflight requests
 *
 * Browsers send an OPTIONS request before certain cross-origin requests
 * (those with custom headers, non-simple methods like PUT/DELETE, etc.)
 * to check if the server allows the actual request.
 */
function handlePreflight(origin: string | null): NextResponse {
  if (origin && allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 204, // No Content
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-CSRF-Token",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
      },
    });
  }

  return new NextResponse(null, { status: 403 });
}

/**
 * =============================================================================
 * PROXY FUNCTION
 * =============================================================================
 *
 * This function runs on EVERY request that matches the config.matcher pattern.
 * It executes in the Edge Runtime, which is faster but has limitations:
 * - No Node.js APIs (fs, crypto.randomBytes, etc.)
 * - Limited npm package support (must be Edge-compatible)
 * - Must use Web APIs (fetch, Headers, etc.)
 *
 * EXECUTION ORDER:
 * 1. Handle CORS preflight (OPTIONS) requests
 * 2. Check CORS origin (block unauthorized origins)
 * 3. Extract session cookie from request
 * 4. Verify JWT token using secret
 * 5. If valid: Extract user info and add to request headers
 * 6. If invalid: Return 401 Unauthorized (for protected routes)
 * 7. Set CORS headers on response
 * 8. Allow request to proceed
 */
export async function proxy(request: NextRequest) {
  const origin = request.headers.get("origin");

  /**
   * STEP 1: Handle CORS preflight requests
   * ----------------------------------------
   * Browsers send OPTIONS requests before certain cross-origin requests.
   * We need to respond with appropriate CORS headers.
   */
  if (request.method === "OPTIONS") {
    return handlePreflight(origin);
  }

  /**
   * STEP 2: CORS origin validation
   * --------------------------------
   * Block requests from unauthorized origins.
   * Note: Requests without an origin header (same-origin, server-to-server)
   * should be allowed through—only cross-origin browser requests have origin.
   */
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: "Forbidden - Origin not allowed",
    });
  }

  /**
   * STEP 3: Create response object (we'll add headers to it)
   * ---------------------------------------------------------
   * We need to create the response early so we can set CORS headers on it.
   */
  let response: NextResponse;

  /**
   * STEP 4: Extract session cookie for authentication
   * --------------------------------------------------
   * The login route sets a cookie named "session" containing the JWT.
   * We read it from the request cookies.
   */
  const sessionCookie = request.cookies.get("session");

  // If no session cookie, user is not authenticated
  if (!sessionCookie?.value) {
    /**
     * SECURITY NOTE: When to return 401 vs allow through?
     *
     * Option 1: Block immediately (stricter)
     *   return NextResponse.json(
     *     { error: "Unauthorized" },
     *     { status: 401 }
     *   );
     *
     * Option 2: Let route handle it (more flexible)
     *   - Some routes might be public
     *   - Route can check headers and decide
     *   - Better for mixed public/private APIs
     *
     * We'll use Option 2 here - set headers to null and let routes decide.
     * But for /api/protected routes, we'll be stricter.
     */

    // For protected API routes, block immediately
    if (request.nextUrl.pathname.startsWith("/api/protected")) {
      response = NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    } else {
      // For other routes, continue without user info
      // (Routes can check headers themselves)
      response = NextResponse.next();
    }

    // Set CORS headers even for unauthenticated requests
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    return response;
  }

  /**
   * STEP 5: Verify JWT token
   * -------------------------
   * jwtVerify checks:
   * - Token signature is valid (not tampered with)
   * - Token hasn't expired
   * - Token was signed with our secret
   *
   * If verification fails, jwtVerify throws an error.
   */
  let payload: { email?: string; role?: string };

  try {
    const { payload: verifiedPayload } = await jwtVerify(
      sessionCookie.value,
      JWT_SECRET
    );

    // Type assertion - in production, validate the payload shape
    payload = verifiedPayload as { email?: string; role?: string };
  } catch (error) {
    /**
     * JWT VERIFICATION FAILED
     *
     * This could mean:
     * 1. Token expired (user needs to log in again)
     * 2. Token tampered with (signature doesn't match)
     * 3. Token signed with wrong secret
     * 4. Malformed token
     *
     * For protected routes, we block immediately.
     * For others, we continue without user info.
     */
    if (request.nextUrl.pathname.startsWith("/api/protected")) {
      response = NextResponse.json(
        {
          error: "Invalid or expired session",
          hint: "Please log in again",
        },
        { status: 401 }
      );
    } else {
      // Invalid token - clear the cookie and continue
      // (The route can decide what to do)
      response = NextResponse.next();
      response.cookies.delete("session");
    }

    // Set CORS headers
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    return response;
  }

  /**
   * STEP 6: Extract user information
   * ---------------------------------
   * The JWT payload contains user data (email, role) set during login.
   * We extract it and validate it exists.
   */
  if (!(payload.email && payload.role)) {
    // Malformed token - missing required fields
    if (request.nextUrl.pathname.startsWith("/api/protected")) {
      response = NextResponse.json(
        { error: "Invalid session data" },
        { status: 401 }
      );
    } else {
      response = NextResponse.next();
      response.cookies.delete("session");
    }

    // Set CORS headers
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    return response;
  }

  /**
   * STEP 7: Add user info to request headers
   * -----------------------------------------
   * Proxy can't modify the request object directly, but we can:
   * - Add headers that route handlers can read
   * - Rewrite the URL
   * - Set cookies in the response
   *
   * We'll add custom headers that API routes can read.
   * This is the standard pattern for passing data from proxy to routes.
   */
  const requestHeaders = new Headers(request.headers);

  // Add user information to headers
  // API routes can read these to get the authenticated user
  requestHeaders.set("x-user-email", payload.email);
  requestHeaders.set("x-user-role", payload.role);

  /**
   * STEP 8: Allow request to proceed with user info
   * -------------------------------------------------
   * We've verified the user and added their info to headers.
   * Now we let the request continue to the route handler.
   *
   * The route handler can:
   * - Read user info from headers
   * - Perform additional authorization checks (e.g., role-based access)
   * - Execute the business logic
   */
  response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  /**
   * STEP 9: Set CORS headers on response
   * -------------------------------------
   * Even though the user is authenticated, we still need to set CORS headers
   * so that browsers allow the response to be read by the requesting origin.
   */
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}

/**
 * =============================================================================
 * PROXY CONFIGURATION
 * =============================================================================
 *
 * matcher: Controls which routes this proxy runs on
 *
 * Patterns:
 * - "/api/:path*" - All API routes (for CORS)
 * - "/api/protected/:path*" - Protected routes (for auth)
 * - "/((?!_next/static|_next/image|favicon.ico).*)" - Everything except Next.js internals
 *
 * WHY USE A MATCHER?
 * - Performance: Proxy runs on every matching request
 * - Avoid running on static assets, images, etc.
 * - Only protect routes that need authentication
 *
 * In this example, we handle:
 * - CORS for all API routes
 * - Authentication for /api/protected/* routes (strict - blocks if no auth)
 * - All other routes can still access headers (optional auth)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

/**
 * =============================================================================
 * REAL-WORLD IMPLEMENTATION NOTES
 * =============================================================================
 *
 * 1. TOKEN REFRESH
 *    - JWT tokens expire (24h in this example)
 *    - Implement refresh tokens for better UX
 *    - Check expiration and issue new token before expiry
 *
 * 2. ROLE-BASED ACCESS CONTROL (RBAC)
 *    - Proxy can check user role
 *    - Block certain routes for non-admin users
 *    - Example: if (user.role !== 'admin') return 403
 *
 * 3. RATE LIMITING
 *    - Can combine with rate limiting in proxy
 *    - Block excessive requests before they reach routes
 *
 * 4. LOGGING & MONITORING
 *    - Log authentication failures
 *    - Track suspicious patterns
 *    - Alert on repeated auth failures
 *
 * 5. CORS HANDLING
 *    - Set CORS headers based on origin (already implemented above)
 *    - Handle preflight OPTIONS requests
 *    - Remember: CORS is not authentication - it only affects browsers
 *
 * 6. MULTI-TENANT APPLICATIONS
 *    - Extract tenant ID from token
 *    - Add to headers for route handlers
 *    - Use for data isolation
 */
