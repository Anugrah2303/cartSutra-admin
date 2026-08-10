import type avatarIF from "./avatar";
import type { ReturnReason, ReturnStatus, RefundMethod } from "../../enums/return.enum";

export interface ReturnPickupAddressIF {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ReturnIF {
  _id: string;
  returnNumber: string;
  order: string;
  orderNumber: string;
  product: string;
  variant?: string | null;
  title: string;
  thumbnail: string;
  customer: string;
  vendor: string;
  reason: ReturnReason;
  description?: string;
  images?: avatarIF[];
  quantity: number;
  unitPrice: number;
  status: ReturnStatus;
  refundAmount: number;
  refundMethod?: RefundMethod | null;
  refundId?: string | null;
  pickupAddress: ReturnPickupAddressIF;
  rejectionReason?: string | null;
  requestedAt: string;
  approvedAt?: string | null;
  pickupScheduledAt?: string | null;
  pickedUpAt?: string | null;
  receivedAt?: string | null;
  refundedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}