import { z } from "zod";

/**
 * =============================================================================
 * TRANSFER FORM VALIDATION SCHEMA
 * =============================================================================
 *
 * This schema is shared between client and server for consistent validation.
 * Using Zod provides:
 * - Type safety with z.infer<typeof schema>
 * - Runtime validation
 * - Clear error messages
 */

export const transferSchema = z.object({
  recipient: z
    .string({ message: "Recipient email is required" })
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),

  amount: z
    .string({ message: "Amount is required" })
    .min(1, "Amount is required")
    .transform((val) => Number.parseFloat(val))
    .refine((val) => !Number.isNaN(val), "Please enter a valid number")
    .refine((val) => val > 0, "Amount must be greater than 0")
    .refine((val) => val <= 10_000, "Maximum transfer amount is $10,000"),
});

export type TransferFormData = z.infer<typeof transferSchema>;

/**
 * Validate transfer form data and return typed result
 */
export function validateTransfer(data: { recipient: string; amount: string }) {
  return transferSchema.safeParse(data);
}
