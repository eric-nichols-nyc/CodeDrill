import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { CheckSquare } from "lucide-react";

export default function ValidationZodPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">Validation with Zod</h1>
          <p className="mt-2 text-muted-foreground">
            Same schema on the client and server
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckSquare className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Why validate with Zod?</CardTitle>
            </div>
            <CardDescription>
              Zod parses unknown input into a typed value and returns clear errors when the shape is wrong. Use one schema on the front (forms, client state) and the same schema on the back (API, server actions) so you never trust the client: the server always re-validates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Define a schema with <code className="rounded bg-muted px-1 py-0.5 text-sm">z.object()</code>, <code className="rounded bg-muted px-1 py-0.5 text-sm">z.string()</code>, <code className="rounded bg-muted px-1 py-0.5 text-sm">z.number()</code>, etc. Call <code className="rounded bg-muted px-1 py-0.5 text-sm">.parse()</code> (throws) or <code className="rounded bg-muted px-1 py-0.5 text-sm">.safeParse()</code> (returns success/error). Use <code className="rounded bg-muted px-1 py-0.5 text-sm">@hookform/resolvers/zod</code> with React Hook Form so validation and error messages stay in sync.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Shared schema</CardTitle>
            <CardDescription>
              Define the schema once and import it in both the form and the API route.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`// lib/schema.ts (or app/signup/schema.ts)
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name required").max(100),
  age: z.coerce.number().int().min(0).max(150).optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;`}
            </pre>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Front: React Hook Form + Zod</CardTitle>
            <CardDescription>
              Use <code className="rounded bg-muted px-1 py-0.5 text-sm">zodResolver(schema)</code> so the form validates and shows Zod error messages before submit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@/lib/schema";

export function SignUpForm() {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", name: "" },
  });

  async function onSubmit(data: SignUpInput) {
    await fetch("/api/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("email")} />
      {form.formState.errors.email?.message}
      <input {...form.register("name")} />
      {form.formState.errors.name?.message}
      <button type="submit">Submit</button>
    </form>
  );
}`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Back: API route</CardTitle>
            <CardDescription>
              Parse the request body with the same schema; return 400 and error details if validation fails.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`import { NextResponse } from "next/server";
import { signUpSchema } from "@/lib/schema";

export async function POST(req: Request) {
  const raw = await req.json();
  const parsed = signUpSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data; // typed as SignUpInput
  // proceed with sign-up...
  return NextResponse.json({ ok: true });
}`}
            </pre>
            <p className="mt-4 text-muted-foreground text-sm">
              Never trust the client: even with client-side validation, always run the same schema on the server before using the data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
