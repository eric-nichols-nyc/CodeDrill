/**
 * =============================================================================
 * SECURITY LAB: Secure Form Component Demo
 * =============================================================================
 *
 * This page demonstrates how to build secure forms in Next.js.
 *
 * KEY SECURITY PRACTICES DEMONSTRATED:
 *
 * 1. CSRF TOKEN INTEGRATION
 *    - Token fetched from server API on component mount
 *    - Token included as hidden field in form
 *    - Server validates token before processing
 *
 * 2. CLIENT-SIDE VALIDATION (Defense in Depth)
 *    - Provides good UX with immediate feedback
 *    - BUT never trust it — always validate server-side
 *    - Attackers can bypass by using curl, Postman, or disabling JS
 *
 * 3. SECURE FORM SUBMISSION
 *    - Use POST for state-changing operations (never GET)
 *    - Include CSRF token in body or header
 *    - Handle errors gracefully without leaking info
 *
 * 4. INPUT SANITIZATION AWARENESS
 *    - React automatically escapes output (XSS protection)
 *    - Never use dangerouslySetInnerHTML with user input
 *    - Be careful with href, src, and style attributes
 */

import { SecureTransferForm } from "./secure-transfer-form";

/**
 * Server Component (Page)
 *
 * Note: In Next.js 15+, cookies can only be set in Route Handlers or
 * Server Actions called as form actions. For CSRF tokens, we use the
 * client component to fetch from our API route on mount.
 */
export default function SecureFormPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="font-bold text-3xl">Secure Form Demo</h1>
          <p className="text-muted-foreground">
            A demonstration of secure form handling in Next.js
          </p>
        </header>

        {/* Security explanation card */}
        <div className="space-y-4 rounded-lg border bg-card p-6">
          <h2 className="font-semibold text-xl">🔐 Security Features</h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>
              ✅ <strong>CSRF Token</strong> — Prevents cross-site request
              forgery
            </li>
            <li>
              ✅ <strong>Server-side Validation</strong> — Never trust client
              input
            </li>
            <li>
              ✅ <strong>HTTP-only Cookie</strong> — Token stored securely
            </li>
            <li>
              ✅ <strong>React XSS Protection</strong> — Auto-escapes output
            </li>
          </ul>
        </div>

        {/* The secure form component - fetches CSRF token on mount */}
        <SecureTransferForm />

        {/* Educational notes */}
        <div className="space-y-4 rounded-lg border bg-muted/50 p-6 text-sm">
          <h3 className="font-semibold">📚 How This Form is Protected</h3>

          <div className="space-y-3">
            <div>
              <strong>1. CSRF Token Flow:</strong>
              <p className="text-muted-foreground">
                Client fetches token from /api/csrf-demo → Server generates
                token & sets cookie → Token returned to client → Form submits
                token in body → Server validates match
              </p>
            </div>

            <div>
              <strong>2. Why Attackers Can&apos;t Forge This:</strong>
              <p className="text-muted-foreground">
                Same-origin policy prevents evil.com from reading our cookies or
                fetching tokens from our API. They can&apos;t include what they
                can&apos;t access.
              </p>
            </div>

            <div>
              <strong>3. Defense in Depth:</strong>
              <p className="text-muted-foreground">
                We combine: CSRF tokens + sameSite cookies + origin checking +
                server validation. Multiple layers mean one failure doesn&apos;t
                compromise everything.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
