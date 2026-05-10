/**
 * =============================================================================
 * SECURITY LAB: Authentication Helper Utilities
 * =============================================================================
 *
 * Helper functions for extracting and using authenticated user information
 * in API routes and server components.
 *
 * These utilities work with the middleware.ts file, which sets custom headers
 * containing user information after JWT verification.
 */

import type { AuthenticatedUser } from "@/proxy";

/**
 * Extract authenticated user from request headers
 *
 * This function reads the custom headers set by middleware.ts after JWT verification.
 * Use this in your API routes to get the current authenticated user.
 *
 * @param headers - Request headers (from Request.headers)
 * @returns AuthenticatedUser object with email and role, or null if not authenticated
 *
 * @example
 * ```typescript
 * export async function GET(request: Request) {
 *   const user = getUserFromRequest(request);
 *
 *   if (!user) {
 *     return Response.json({ error: "Unauthorized" }, { status: 401 });
 *   }
 *
 *   // User is authenticated, use user.email and user.role
 *   return Response.json({ message: `Hello, ${user.email}` });
 * }
 * ```
 */
export function getUserFromRequest(request: Request): AuthenticatedUser | null {
  const email = request.headers.get("x-user-email");
  const role = request.headers.get("x-user-role");

  if (!(email && role)) {
    return null;
  }

  return { email, role };
}

/**
 * Require authentication - throws error if user is not authenticated
 *
 * Convenience function that combines getting the user and checking if they exist.
 * Throws an error response if not authenticated, which you can return directly.
 *
 * @param request - The incoming Request object
 * @returns AuthenticatedUser object
 * @throws Response object with 401 status if not authenticated
 *
 * @example
 * ```typescript
 * export async function GET(request: Request) {
 *   const user = requireAuth(request);
 *   // If we get here, user is guaranteed to be authenticated
 *   return Response.json({ data: `Hello, ${user.email}` });
 * }
 * ```
 */
export function requireAuth(request: Request): AuthenticatedUser {
  const user = getUserFromRequest(request);

  if (!user) {
    throw new Response(
      JSON.stringify({ error: "Unauthorized - Authentication required" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return user;
}

/**
 * Require specific role - throws error if user doesn't have the role
 *
 * Use this for role-based access control (RBAC).
 * Checks if user is authenticated AND has the required role.
 *
 * @param request - The incoming Request object
 * @param requiredRole - The role required to access the resource
 * @returns AuthenticatedUser object
 * @throws Response object with 401 if not authenticated, or 403 if wrong role
 *
 * @example
 * ```typescript
 * export async function DELETE(request: Request) {
 *   const user = requireRole(request, "admin");
 *   // If we get here, user is guaranteed to be an admin
 *   return Response.json({ message: "Admin operation completed" });
 * }
 * ```
 */
export function requireRole(
  request: Request,
  requiredRole: string
): AuthenticatedUser {
  const user = requireAuth(request);

  if (user.role !== requiredRole) {
    throw new Response(
      JSON.stringify({
        error: "Forbidden",
        message: `This action requires ${requiredRole} role`,
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return user;
}
