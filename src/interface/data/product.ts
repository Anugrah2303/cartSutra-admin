import type avatarIF from "./avatar.js";
import type { ProductApprovalStatus, ProductLifecycleStatus } from "../../enums/product.enum.js";

export interface ProductVariant {
    sku: string;
    attributes: Record<string, string>;
    price: number;
    salePrice?: number;
    stock: number;
    avatar: avatarIF[];
    isDefault: boolean;
}

export interface ApprovalHistory {
    status: ProductApprovalStatus;
    reviewedBy: string;
    reason?: string | null;
    reviewedAt: Date;
    comment?: string | null;
}

export interface ProductIF extends Document {

    title: string;
    slug: string;
    description: string;
    shortDescription?: string;

    seller: string

    category: string;
    brand?: string | null;

    price: number;
    discount: number;
    costPrice: number;
    shippingCost: number;

    stock: number;
    soldCount: number;
    lowStockAlert: number;

    thumbnailImage: avatarIF;
    productImages: avatarIF[];

    variants?: ProductVariant[];

    rating: number;
    totalReviews: number;
    totalViews: number;
    totalWishlist: number;

    tags: string[];
    width: number;
    length: number;
    height: number;
    weight: number;

    status: ProductLifecycleStatus;
    featured: boolean;

    reviewedBy: string;
    reviewedAt: Date
    approvalStatus: ProductApprovalStatus
    rejectedReason: string | null

    approvalHistory: ApprovalHistory[];

    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Date | null;

    _id: string
    createdAt: Date
    updatedAt: Date
}