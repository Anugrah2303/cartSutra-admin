import { ReturnStatus } from "../../enums/return.enum";

export const RETURN_STATUS_STYLES: Record<string, string> = {
    [ReturnStatus.REQUESTED]: "bg-amber-100 text-amber-700",
    [ReturnStatus.APPROVED]: "bg-blue-100 text-blue-700",
    [ReturnStatus.REJECTED]: "bg-red-100 text-red-700",
    [ReturnStatus.PICKUP_SCHEDULED]: "bg-indigo-100 text-indigo-700",
    [ReturnStatus.PICKED_UP]: "bg-teal-100 text-teal-700",
    [ReturnStatus.RECEIVED]: "bg-teal-100 text-teal-700",
    [ReturnStatus.REFUND_PENDING]: "bg-orange-100 text-orange-700",
    [ReturnStatus.REFUNDED]: "bg-green-100 text-green-700",
    [ReturnStatus.CANCELLED]: "bg-gray-100 text-gray-600",
};

export const RETURN_STATUS_OPTIONS = Object.values(ReturnStatus);