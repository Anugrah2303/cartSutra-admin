import { OrderStatus, PaymentStatus, PaymentMethod } from "../../enums/order.enum";

export const ORDER_STATUS_STYLES: Record<string, string> = {
    [OrderStatus.PENDING]: "bg-amber-100 text-amber-700",
    [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-700",
    [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-700",
    [OrderStatus.PACKED]: "bg-indigo-100 text-indigo-700",
    [OrderStatus.SHIPPED]: "bg-teal-100 text-teal-700",
    [OrderStatus.OUT_FOR_DELIVERY]: "bg-teal-100 text-teal-700",
    [OrderStatus.DELIVERED]: "bg-green-100 text-green-700",
    [OrderStatus.CANCELLED]: "bg-red-100 text-red-700",
    [OrderStatus.RETURN_REQUESTED]: "bg-orange-100 text-orange-700",
    [OrderStatus.RETURNED]: "bg-orange-100 text-orange-700",
    [OrderStatus.REFUNDED]: "bg-gray-100 text-gray-600",
    [OrderStatus.FAILED]: "bg-red-100 text-red-700",
};

export const PAYMENT_STATUS_STYLES: Record<string, string> = {
    [PaymentStatus.PENDING]: "bg-amber-100 text-amber-700",
    [PaymentStatus.PAID]: "bg-green-100 text-green-700",
    [PaymentStatus.FAILED]: "bg-red-100 text-red-700",
    [PaymentStatus.REFUNDED]: "bg-gray-100 text-gray-600",
    [PaymentStatus.REFUND_PENDING]: "bg-orange-100 text-orange-700",
    [PaymentStatus.PARTIALLY_REFUNDED]: "bg-orange-100 text-orange-700",
};

// Mirrors the backend's statusFlow in updateOrderStatusModule — used only to
// grey out obviously-backward transitions in the UI. Backend is the source of truth.
export const ORDER_STATUS_FLOW: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
    OrderStatus.PACKED,
    OrderStatus.SHIPPED,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
];

export const ORDER_STATUS_OPTIONS = Object.values(OrderStatus);
export const PAYMENT_STATUS_OPTIONS = Object.values(PaymentStatus);
export const PAYMENT_METHOD_OPTIONS = Object.values(PaymentMethod);