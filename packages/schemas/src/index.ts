import { z } from "zod";

export const roleSchema = z.enum(["INTERN", "ENGINEER", "ADMIN"]);

export const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().min(1),
  role: roleSchema,
});

export type UserDto = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  email: z.string().trim().min(1, "email is required"),
  role: z
    .string()
    .trim()
    .min(1, "role is required")
    .toUpperCase()
    .pipe(roleSchema),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
