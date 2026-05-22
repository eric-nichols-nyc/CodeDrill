import { DevAuthFormFill } from "@/components/dev-auth-form-fill";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

const AUTH_PATHS = ["sign-in", "sign-up"] as const;

export function generateStaticParams() {
  return AUTH_PATHS.map((path) => ({ path }));
}

export default async function AuthPage({
  params,
  searchParams,
}: {
  params: Promise<{ path: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { path } = await params;
  const { next } = await searchParams;

  if (!AUTH_PATHS.includes(path as (typeof AUTH_PATHS)[number])) {
    notFound();
  }

  const isDev = process.env.NODE_ENV === "development";
  const testEmail = process.env.AUTH_TEST_EMAIL;
  const testPassword = process.env.AUTH_TEST_PASSWORD;
  const testName = process.env.AUTH_TEST_NAME;
  const showDevFill =
    isDev &&
    typeof testEmail === "string" &&
    testEmail.length > 0 &&
    typeof testPassword === "string" &&
    testPassword.length > 0;

  const nextPath = typeof next === "string" && next.startsWith("/") ? next : "/dashboard";

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
        <h1 className="font-semibold text-xl">
          {path === "sign-up" ? "Create account" : "Sign in"}
        </h1>
        {path === "sign-up" ? (
          <SignUpForm
            defaultEmail={testEmail ?? ""}
            defaultName={testName ?? "Test User"}
            defaultPassword={testPassword ?? ""}
            nextPath={nextPath}
          />
        ) : (
          <SignInForm
            defaultEmail={testEmail ?? ""}
            defaultPassword={testPassword ?? ""}
            nextPath={nextPath}
          />
        )}
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
