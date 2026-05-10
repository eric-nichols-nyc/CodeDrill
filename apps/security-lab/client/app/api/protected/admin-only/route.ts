/**
 * =============================================================================
 * SECURITY LAB: Role-Based Authorization Example
 * =============================================================================
 *
 * This endpoint demonstrates role-based access control (RBAC).
 * It requires not just authentication, but also the "admin" role.
 *
 * KEY INTERVIEW TALKING POINTS:
 * ---------------------------------------------------------------------------
 *
 * AUTHENTICATION vs AUTHORIZATION:
 * - Authentication = "Are you logged in?" (middleware checks JWT)
 * - Authorization = "Do you have permission?" (route checks role)
 *
 * LAYERS OF SECURITY:
 * 1. Middleware: Verifies JWT token (authentication)
 * 2. Route handler: Checks user role (authorization)
 * 3. Business logic: Validates specific permissions if needed
 *
 * WHY CHECK ROLES IN ROUTE, NOT JUST MIDDLEWARE?
 * - Middleware can check roles, but routes need flexibility
 * - Some routes might allow multiple roles
 * - Some routes need complex permission logic
 * - Business rules might depend on context (e.g., user owns resource)
 *
 * DEFENSE IN DEPTH:
 * - Middleware blocks invalid tokens (first layer)
 * - Route checks role (second layer)
 * - Database queries filter by user ID/role (third layer)
 * - Multiple layers = harder to bypass
 *
 * TEST THIS:
 * ---------------------------------------------------------------------------
 * Step 1: Login as regular user
 *   curl -X POST http://localhost:3008/api/login \
 *     -H "Content-Type: application/json" \
 *     -d '{"email":"user@test.com","password":"user123"}' \
 *     -c cookies.txt
 *
 * Step 2: Try to access admin route (fails with 403)
 *   curl http://localhost:3008/api/protected/admin-only -b cookies.txt
 *
 * Step 3: Login as admin
 *   curl -X POST http://localhost:3008/api/login \
 *     -H "Content-Type: application/json" \
 *     -d '{"email":"admin@test.com","password":"admin123"}' \
 *     -c cookies.txt
 *
 * Step 4: Access admin route (succeeds)
 *   curl http://localhost:3008/api/protected/admin-only -b cookies.txt
 */

import { requireRole } from "@/lib/auth";

/**
 * GET /api/protected/admin-only
 *
 * Admin-only endpoint that demonstrates role-based authorization.
 * Requires authentication AND admin role.
 *
 * This endpoint would be used for:
 * - System configuration
 * - User management
 * - Analytics/reports
 * - Any administrative operations
 */
export async function GET(request: Request) {
  /**
   * requireRole() does two things:
   * 1. Checks if user is authenticated (throws 401 if not)
   * 2. Checks if user has the required role (throws 403 if not)
   *
   * If we get past this line, we're guaranteed:
   * - User is authenticated
   * - User has "admin" role
   */
  const user = requireRole(request, "admin");

  /**
   * In a real application, you might:
   * - Query database for admin-only data
   * - Perform administrative operations
   * - Return system-wide statistics
   * - Manage other users
   */

  return Response.json({
    message: "Admin access granted",
    user: {
      email: user.email,
      role: user.role,
    },
    adminData: {
      // Example admin-only information
      totalUsers: 42, // Would come from database
      systemStatus: "operational",
      lastBackup: "2024-01-15T10:30:00Z",
      note: "This data is only visible to administrators",
    },
  });
}

/**
 * DELETE /api/protected/admin-only/users/:id
 *
 * Example of an admin-only operation: deleting users.
 * This demonstrates that even for admin operations, you should:
 * - Validate input (user ID exists, is valid)
 * - Log the action (audit trail)
 * - Return appropriate responses
 *
 * Note: This is a simplified example. In production, you'd:
 * - Accept user ID as a URL parameter or in request body
 * - Check if user exists before deleting
 * - Soft delete vs hard delete
 * - Cascade delete related data appropriately
 * - Send notifications
 */
export async function DELETE(request: Request) {
  const user = requireRole(request, "admin");

  // Parse request to get user ID to delete
  const url = new URL(request.url);
  const targetUserId = url.searchParams.get("userId");

  if (!targetUserId) {
    return Response.json(
      { error: "userId query parameter is required" },
      { status: 400 }
    );
  }

  /**
   * In production, you would:
   * 1. Validate targetUserId (format, exists, etc.)
   * 2. Check business rules (can't delete yourself, etc.)
   * 3. Log the action for audit trail
   *    await auditLog.create({
   *      action: "user_deleted",
   *      adminEmail: user.email,
   *      targetUserId,
   *      timestamp: new Date()
   *    });
   * 4. Delete the user (or soft delete)
   *    await db.user.delete({ where: { id: targetUserId } });
   * 5. Send notifications if needed
   */

  return Response.json({
    message: "User deleted successfully",
    deletedBy: user.email,
    targetUserId,
    note: "In production, this would actually delete the user from the database",
  });
}
