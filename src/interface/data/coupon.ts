import type { DiscountType } from "../../enums/coupon.enum";

export interface CouponIF  {

    code: string;

    description?: string;

    discountType: DiscountType;

    discountValue: number;

    maxDiscountAmount?: number | null;

    minOrderAmount: number;

    usageLimit?: number | null;

    usageLimitPerUser: number;

    usedCount: number;

    validFrom: Date;

    validUntil: Date;

    isActive: boolean;

    isDeleted: boolean;

    _id: string;

    createdAt: Date;

    updatedAt: Date;
}