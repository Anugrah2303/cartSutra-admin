import { z } from "zod";

export const settingDetailsSchema = z.object({
  siteName: z.string().trim().min(2, "Site name is required"),
  tagline: z.string().trim().optional(),
  contactEmail: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  contactPhone: z.string().trim().optional(),
  supportEmail: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  addressLine1: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  currency: z.string().trim().min(1),
  currencySymbol: z.string().trim().min(1),
  taxPercentage: z.coerce.number().min(0).max(100),
  freeShippingThreshold: z.coerce.number().min(0),
  defaultShippingCharge: z.coerce.number().min(0),
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z.string().trim().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  metaKeywords: z.string().trim().optional(),
  facebook: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  instagram: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  twitter: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  youtube: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  linkedin: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
});

export type SettingDetailsFormValues = z.input<typeof settingDetailsSchema>;
export type SettingDetailsFormOutput = z.output<typeof settingDetailsSchema>;