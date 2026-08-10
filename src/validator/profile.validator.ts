import { z } from "zod";

export const profileDetailsSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
});

export type ProfileDetailsFormValues = z.infer<typeof profileDetailsSchema>;

export const changePasswordSchema = z.object({
  password: z.string().min(5, "Current password is required"),
  newPassword: z.string().min(5, "New password must be at least 5 characters"),
  conformPassword: z.string().min(5, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.conformPassword, {
  message: "Passwords do not match",
  path: ["conformPassword"],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;