import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  description: z.string().trim().optional(),
  website: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
});

export type BrandFormValues = z.input<typeof brandSchema>;
export type BrandFormOutput = z.output<typeof brandSchema>;