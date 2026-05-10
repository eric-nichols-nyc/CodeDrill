/**
 * =============================================================================
 * SECURITY LAB: Protected API Route Example
 * =============================================================================
 *
 * This endpoint demonstrates how middleware authorizes users and how API routes
 * access the authenticated user information.
 *
 * HOW IT WORKS:
 * ---------------------------------------------------------------------------
 * 1. Client makes request to /api/protected/user-profile
 * 2. Middleware (middleware.ts) intercepts the request
 * 3. Middleware extracts session cookie and verifies JWT token
 * 4. If valid, middleware adds user info (email, role) to request headers
 * 5. Request proceeds to this route handler
 * 6. Route handler reads user info from headers
 * 7. Route handler executes business logic with authenticated user
 *
 * KEY INTERVIEW TALKING POINTS:
 * ---------------------------------------------------------------------------
 *
 * WHY SEPARATE AUTHENTICATION FROM AUTHORIZATION?
 * - Authentication = "Who are you?" (middleware verifies JWT)
 * - Authorization = "What can you do?" (route checks roles/permissions)
 * - Separation allows flexibility: some routes might be public but personalized
 *
 * WHY PASS DATA VIA HEADERS?
 * - Middleware can't modify the request object directly
 * - Headers are the standard way to pass data middleware → route
 * - Headers are fast and don't require database lookups
 * - Route handlers can read headers synchronously
 *
 * ALTERNATIVE APPROACHES:
 * - Store user ID in JWT, look up full user in route (slower, more flexible)
 * - Use request context/session storage (framework-dependent)
 * - Pass user object via custom request property (requires TypeScript augmentation)
 */

import { getUserFromRequest, requireAuth } from "@/lib/auth";

/**
 * GET /api/protected/user-profile
 *
 * Returns the current user's profile information.
 * Requires authentication (middleware enforces this).
 *
 * This demonstrates:
 * - Reading user information from headers set by proxy
 * - Using the getUserFromRequest helper for optional auth
 * - Returning user-specific data
 *
 * TEST THIS:
 * ---------------------------------------------------------------------------
 * Step 1: Login to get a session cookie
 *   curl -X POST http://localhost:3008/api/login \
 *     -H "Content-Type: application/json" \
 *     -d '{"email":"user@test.com","password":"user123"}' \
 *     -c cookies.txt
 *
 * Step 2: Access protected route (succeeds)
 *   curl http://localhost:3008/api/protected/user-profile -b cookies.txt
 *
 * Step 3: Try without authentication (fails - blocked by middleware)
 *   curl http://localhost:3008/api/protected/user-profile
 */
export async function GET(request: Request) {
  /**
   * OPTION 1: Using getUserFromRequest (manual check)
   * --------------------------------------------------
   * Use this when you want explicit control over the error response.
   */
  const user = getUserFromRequest(request);

  if (!user) {
    // This shouldn't happen for /api/protected/* routes because
    // middleware blocks unauthenticated requests before they reach here.
    // But it's good defensive programming.
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  /**
   * OPTION 2: Using requireAuth (throws on error)
   * -----------------------------------------------
   * Uncomment to use the helper function instead:
   *
   * const user = requireAuth(request);
   *
   * This throws a Response object if not authenticated, which Next.js
   * will handle correctly. More concise, but less explicit.
   */

  // At this point, we know the user is authenticated
  // The middleware has verified their JWT token

  /**
   * SIMULATE DATABASE LOOKUP
   * -------------------------
   * In a real application, you would:
   * 1. Use the user.email or user ID from the JWT
   * 2. Query your database for the full user profile
   * 3. Return the profile data
   *
   * Example:
   *   const profile = await db.user.findUnique({
   *     where: { email: user.email },
   *     select: { email: true, name: true, createdAt: true }
   *   });
   */

  return Response.json({
    message: "Successfully accessed protected route",
    user: {
      email: user.email,
      role: user.role,
      authenticated: true,
    },
    // In production, you'd include more profile data:
    // name: profile.name,
    // createdAt: profile.createdAt,
    // preferences: profile.preferences,
  });
}

/**
 * PUT /api/protected/user-profile
 *
 * Updates the current user's profile.
 * Requires authentication.
 *
 * This demonstrates:
 * - Authentication check (middleware)
 * - Input validation
 * - Updating user-specific data
 */
export async function PUT(request: Request) {
  // Ensure user is authenticated
  const user = requireAuth(request);

  // Parse and validate input
  let body: { name?: string; preferences?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  /**
   * In production, you would:
   * 1. Validate input with Zod or similar
   * 2. Update database: await db.user.update({ where: { email: user.email }, data: body })
   * 3. Return updated profile
   */

  return Response.json({
    message: "Profile updated successfully",
    user: {
      email: user.email,
      role: user.role,
      updatedFields: Object.keys(body),
    },
  });
}
