"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function authHref(
  pathname: string,
  search: string,
  path: "/sign-in" | "/sign-up"
): string {
  const returnTo = `${pathname}${search}`;
  return `${path}?redirect_url=${encodeURIComponent(returnTo)}`;
}

export function EditorRunSubmitAuthPrompt() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const suffix = search ? `?${search}` : "";
  const signInHref = authHref(pathname, suffix, "/sign-in");
  const signUpHref = authHref(pathname, suffix, "/sign-up");

  return (
    <div className="w-full rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-foreground text-sm">
      <p className="text-center">
        You need to{" "}
        <Link
          className="font-medium text-primary underline-offset-4 hover:underline"
          href={signInHref}
        >
          log in
        </Link>{" "}
        /{" "}
        <Link
          className="font-medium text-primary underline-offset-4 hover:underline"
          href={signUpHref}
        >
          sign up
        </Link>{" "}
        to run or submit.
      </p>
    </div>
  );
}
