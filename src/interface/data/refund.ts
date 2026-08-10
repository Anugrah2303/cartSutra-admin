import type { RefundMethod } from "../../enums/return.enum";
import type { RefundStatus, RefundSource } from "../../enums/refund.enum";

export interface RefundIF {
  _id: string;
  refundNumber: string;
  order: string;
  orderNumber: string;
  return?: string | null;
  customer: string;
  vendor?: string | null;
  source: RefundSource;
  reason: string;
  amount: number;
  quantity?: number | null;
  method: RefundMethod;
  status: RefundStatus;
  gatewayRefundId?: string | null;
  gatewayStatus?: string | null;
  failureReason?: string | null;
  initiatedBy: string;
  processedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}