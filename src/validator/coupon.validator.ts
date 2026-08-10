import { z } from "zod";
import { DiscountType } from "../enums/coupon.enum";

export const couponSchema = z.object({
  code: z.string().trim().min(3, "Code must be at least 3 characters").toUpperCase(),
  description: z.string().trim().optional(),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.coerce.number().positive("Discount value must be greater than 0"),
  maxDiscountAmount: z.coerce.number().min(0).optional(),
  minOrderAmount: z.coerce.number().min(0).default(0),
  usageLimit: z.coerce.number().int().min(1).optional(),
  usageLimitPerUser: z.coerce.number().int().min(1).default(1),
  validFrom: z.string().min(1, "Start date is required"),
  validUntil: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.validUntil) > new Date(data.validFrom), {
  message: "End date must be after start date",
  path: ["validUntil"],
});

export type CouponFormValues = z.input<typeof couponSchema>;
export type CouponFormOutput = z.output<typeof couponSchema>;