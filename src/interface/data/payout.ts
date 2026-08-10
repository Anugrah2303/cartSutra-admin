import type { PayoutStatus, PayoutMethod } from "../../enums/payout.enum";
import type avatarIF from "./avatar";

export interface PayoutVendorDetailsIF {
  shopName: string;
  vendorId: string;
  shopLogo?: avatarIF;
}

export interface PayoutIF {
  _id: string;
  payoutNumber: string;
  vendor: string;
  vendorDetails?: PayoutVendorDetailsIF;
  amount: number;
  method: PayoutMethod;
  status: PayoutStatus;
  requestedAt: string;
  processedAt?: string | null;
  transactionRef?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
}