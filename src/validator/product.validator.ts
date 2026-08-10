import { z } from "zod";

export const productSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().trim().optional(),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),

  costPrice: z.coerce.number().positive("Cost price must be greater than 0"),
  price: z.coerce.number().positive("Price must be greater than 0"),

  discount: z.coerce.number().min(0).max(100).default(0),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  lowStockAlert: z.coerce.number().min(0).default(5),
  tags: z.string().optional(),
});

// Pre-coercion shape — what react-hook-form actually manages internally
export type ProductFormValues = z.input<typeof productSchema>;

// Post-coercion shape — what you get after successful validation (numbers, defaults applied)
export type ProductFormOutput = z.output<typeof productSchema>;