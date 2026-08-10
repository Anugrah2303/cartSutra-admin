import { z } from "zod";

export const loginSchema = z.object({
    loginId: z
        .string()
        .trim()
        .min(1, "Email or User ID is required")
        .refine(
            (value) => {
                if (value.includes("@")) {
                    return z.email().safeParse(value).success;
                }

                return /^[a-zA-Z0-9._-]{3,30}$/.test(value);
            },
            {
                message: "Enter a valid email or User ID",
            }
        ),

    password: z
        .string()
        .min(5, "Password must be at least 5 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>;