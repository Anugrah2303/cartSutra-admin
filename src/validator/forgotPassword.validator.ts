import { z } from "zod";

export const forgotPasswordEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export type ForgotPasswordEmailForm = z.infer<typeof forgotPasswordEmailSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(5, "Password must be at least 5 characters"),
    conformPassword: z.string().min(5, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.conformPassword, {
    message: "Passwords do not match",
    path: ["conformPassword"],
  });

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;