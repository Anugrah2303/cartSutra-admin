// src/components/refunds/refundStyles.ts
import { RefundStatus, RefundSource } from "../../enums/refund.enum";

export const REFUND_STATUS_STYLES: Record<string, string> = {
    [RefundStatus.PENDING]: "bg-amber-100 text-amber-700",
    [RefundStatus.PROCESSING]: "bg-blue-100 text-blue-700",
    [RefundStatus.COMPLETED]: "bg-green-100 text-green-700",
    [RefundStatus.FAILED]: "bg-red-100 text-red-700",
    [RefundStatus.CANCELLED]: "bg-gray-100 text-gray-600",
};

export const REFUND_SOURCE_LABELS: Record<string, string> = {
    [RefundSource.ORDER_CANCELLATION]: "Order Cancellation",
    [RefundSource.RETURN]: "Return",
    [RefundSource.MANUAL]: "Manual",
};

export const REFUND_STATUS_OPTIONS = Object.values(RefundStatus);
export const REFUND_SOURCE_OPTIONS = Object.values(RefundSource);