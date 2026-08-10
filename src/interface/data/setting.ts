import type avatarIF from "./avatar";

export interface SettingSocialLinksIF {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
}

export interface SettingIF {
  _id: string;
  siteName: string;
  tagline?: string;
  logo: avatarIF;
  favicon: avatarIF;
  contactEmail?: string;
  contactPhone?: string;
  supportEmail?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  socialLinks: SettingSocialLinksIF;
  currency: string;
  currencySymbol: string;
  taxPercentage: number;
  freeShippingThreshold: number;
  defaultShippingCharge: number;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
}