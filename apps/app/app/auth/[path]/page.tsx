import { DevAuthFormFill } from "@/components/dev-auth-form-fill";
import { AuthView } from "@neondatabase/neon-js/auth/react/ui";
import Link from "next/link";

export const dynamicParams = false;

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  const isDev = process.env.NODE_ENV === "development";
  const testEmail = process.env.NEON_AUTH_TEST_EMAIL;
  const testPassword = process.env.NEON_AUTH_TEST_PASSWORD;
  const testName = process.env.NEON_AUTH_TEST_NAME;
  const showDevFill =
    isDev &&
    typeof testEmail === "string" &&
    testEmail.length > 0 &&
    typeof testPassword === "string" &&
    testPassword.length > 0 &&
    (path === "sign-in" || path === "sign-up");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-border border-b">
        <div className="container mx-auto flex items-center px-4 py-3 md:px-6">
          <Link
            className="font-medium text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
            href="/"
          >
            Home
          </Link>
        </div>
      </header>
      <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
        <AuthView path={path} />
        {showDevFill ? (
          <DevAuthFormFill
            authPath={path}
            email={testEmail}
            name={testName ?? "Test User"}
            password={testPassword}
          />
        ) : null}
      </main>
    </div>
  );
}
