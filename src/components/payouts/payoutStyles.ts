// src/components/payouts/payoutStyles.ts
import { PayoutStatus, PayoutMethod } from "../../enums/payout.enum";

export const PAYOUT_STATUS_STYLES: Record<string, string> = {
    [PayoutStatus.PENDING]: "bg-amber-100 text-amber-700",
    [PayoutStatus.PROCESSING]: "bg-blue-100 text-blue-700",
    [PayoutStatus.COMPLETED]: "bg-green-100 text-green-700",
    [PayoutStatus.FAILED]: "bg-red-100 text-red-700",
    [PayoutStatus.REJECTED]: "bg-gray-100 text-gray-600",
};

export const PAYOUT_STATUS_OPTIONS = Object.values(PayoutStatus);
export const PAYOUT_METHOD_OPTIONS = Object.values(PayoutMethod);