"use server";

import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required")
    .max(1024, "Password is too long"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type LoginResult =
  | { success: true; data: LoginInput }
  | {
      success: false;
      error?: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = await Promise.resolve(loginSchema.safeParse(raw));

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<
      string,
      string[]
    >;
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors,
    };
  }

  return { success: true, data: parsed.data };
}
