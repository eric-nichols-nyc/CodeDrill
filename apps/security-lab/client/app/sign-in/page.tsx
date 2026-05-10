"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { useState } from "react";
import { type LoginResult, loginAction } from "./actions";

const API_URL = "http://localhost:4000/api/auth/login";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<LoginResult | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const validation = await loginAction(formData);

    if (!validation.success) {
      setResult(validation);
      return;
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(validation.data),
    });

    if (res.ok) {
      setResult({ success: true, data: validation.data });
    } else {
      setResult({
        success: false,
        error: "Invalid credentials",
      });
    }
  }

  const emailError =
    result?.success === false && result.fieldErrors?.email?.[0];
  const passwordError =
    result?.success === false && result.fieldErrors?.password?.[0];

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to sign in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {result?.success === false && result.error ? (
              <p className="text-destructive text-sm">{result.error}</p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                autoComplete="email"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                value={email}
              />
              {emailError ? (
                <p className="text-destructive text-sm">{emailError}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                autoComplete="current-password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                value={password}
              />
              {passwordError ? (
                <p className="text-destructive text-sm">{passwordError}</p>
              ) : null}
            </div>
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
