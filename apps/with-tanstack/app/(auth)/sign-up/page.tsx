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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signUp.email({
      email,
      password,
      name: name.trim() || email.split("@")[0],
      callbackURL: "/dashboard",
    });
    setLoading(false);
    if (result.error) {
      setError(result.error.message ?? "Sign up failed");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create an account with your email</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                type="text"
                value={name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
              />
              <p className="text-muted-foreground text-xs">
                Minimum 8 characters
              </p>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
          <p className="mt-4 text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignUpPage;
