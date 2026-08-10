import type avatarIF from "./avatar";
import type { ReviewReportReason } from "../../enums/review.enum";

export interface VendorReplyIF {
  comment: string;
  repliedAt: string;
  repliedBy: string;
}

export interface ReviewReportIF {
  user: string;
  reason: ReviewReportReason;
  description?: string;
  reportedAt: string;
}

export interface ReviewIF {
  _id: string;
  product: string;
  order: string;
  user: string;
  vendor: string;
  variant?: string | null;
  rating: number;
  title?: string;
  comment: string;
  images?: avatarIF[];
  isVerifiedPurchase: boolean;
  helpfulBy: string[];
  notHelpfulBy: string[];
  vendorReply?: VendorReplyIF | null;
  reports: ReviewReportIF[];
  isReported: boolean;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  // populated by the admin list/report pipeline
  productInfo?: { _id: string; title: string; thumbnailImage?: avatarIF };
  userInfo?: { _id: string; firstName: string; lastName: string; email: string };
  vendorInfo?: { shopName: string };
}