import type { VendorApprovalStatus, VendorType } from "../../enums/vendor.enum.js";
import type avatarIF from "./avatar.js";


export interface BankDetails {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    branchName: string;
    ifscCode: string;
    upiId?: string;
}

export interface TaxDetails {
    gstNumber?: string;
    panNumber?: string;
}

export interface PlainAddress {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface SocialLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
}

export interface KycDocuments {
    gstCertificate?: avatarIF;
    panCard?: avatarIF;
    aadhaarFront?: avatarIF;
    aadhaarBack?: avatarIF;
    cancelledCheque?: avatarIF;
}

export interface VendorIF extends Document {
    _id: string
    user: string;

    vendorId: string;

    shopName: string;
    shopSlug: string;
    shopLogo?: avatarIF;
    shopBanner?: avatarIF;
    shopDescription?: string;

    vendorType: VendorType;

    approvalStatus: VendorApprovalStatus;
    approvedBy?: string;
    approvedAt?: Date;
    rejectedReason?: string;

    commissionRate: number;

    walletBalance: number;

    totalSales: number;
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;

    averageRating: number;
    totalReviews: number;

    isVacationMode: boolean;
    vacationMessage?: string;

    estimatedDispatchDays: number;

    returnPolicy?: string;
    cancellationPolicy?: string;
    shippingPolicy?: string;

    supportEmail?: string;
    supportPhone?: string;
    website?: string;

    socialLinks: SocialLinks;

    bankDetails: BankDetails;

    taxDetails: TaxDetails;

    businessAddress: PlainAddress;

    pickupAddress: PlainAddress;

    kycDocuments: KycDocuments;

    lastPayoutAt: Date,

    isVerified: boolean;
    isActive: boolean;
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}