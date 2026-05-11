import { DevAuthFormFill } from "@/components/dev-auth-form-fill";
import { AuthView } from "@neondatabase/neon-js/auth/react/ui";

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
  );
}
