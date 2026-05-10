import { z } from "zod";
export declare const roleSchema: z.ZodEnum<{
    INTERN: "INTERN";
    ENGINEER: "ENGINEER";
    ADMIN: "ADMIN";
}>;
export declare const userSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        INTERN: "INTERN";
        ENGINEER: "ENGINEER";
        ADMIN: "ADMIN";
    }>;
}, z.core.$strip>;
export type UserDto = z.infer<typeof userSchema>;
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodPipe<z.ZodString, z.ZodEnum<{
        INTERN: "INTERN";
        ENGINEER: "ENGINEER";
        ADMIN: "ADMIN";
    }>>;
}, z.core.$strip>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
