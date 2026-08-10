import type avatarIF from "./avatar";
import type { BannerPosition, BannerLinkType } from "../../enums/banner.enum";

export interface BannerIF {
  _id: string;
  title: string;
  subtitle?: string;
  image: avatarIF;
  mobileImage?: avatarIF;
  position: BannerPosition;
  displayOrder: number;
  linkType: BannerLinkType;
  linkValue?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  viewCount: number;
  clickCount: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}