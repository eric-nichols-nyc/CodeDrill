"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = exports.userSchema = exports.roleSchema = void 0;
const zod_1 = require("zod");
exports.roleSchema = zod_1.z.enum(["INTERN", "ENGINEER", "ADMIN"]);
exports.userSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().min(1),
    role: exports.roleSchema,
});
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "name is required"),
    email: zod_1.z.string().trim().min(1, "email is required"),
    role: zod_1.z
        .string()
        .trim()
        .min(1, "role is required")
        .toUpperCase()
        .pipe(exports.roleSchema),
});
//# sourceMappingURL=index.js.map