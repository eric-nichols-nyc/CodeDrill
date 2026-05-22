"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { persistAuthToken } from "@/lib/auth/token";

type SignUpFormProps = {
  nextPath?: string;
  defaultEmail?: string;
  defaultPassword?: string;
  defaultName?: string;
};

export function SignUpForm({
  nextPath = "/dashboard",
  defaultEmail = "",
  defaultPassword = "",
  defaultName = "",
}: SignUpFormProps) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const { error: signUpError } = await authClient.signUp.email(
      { name, email, password },
      {
        onSuccess: (ctx) => {
          const token = ctx.response.headers.get("set-auth-token");
          if (token) {
            persistAuthToken(token);
          }
        },
      }
    );

    setPending(false);

    if (signUpError) {
      setError(signUpError.message ?? "Sign up failed.");
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <form className="flex w-full max-w-sm flex-col gap-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          autoComplete="name"
          id="name"
          onChange={(e) => setName(e.target.value)}
          required
          type="text"
          value={name}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          autoComplete="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          autoComplete="new-password"
          id="password"
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button disabled={pending} type="submit">
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link className="text-foreground underline-offset-4 hover:underline" href="/auth/sign-in">
          Sign in
        </Link>
      </p>
    </form>
  );
}
