import type { OrderStatus, PaymentMethod, PaymentStatus } from "../../enums/order.enum.js";
import type { AddressIF } from "./address.js";

export interface OrderItemIF {

    product: string;

    seller: string;

    variant?: string;

    title: string;

    slug: string;

    thumbnail: string;

    quantity: number;

    price: number;

    discount: number;

    finalPrice: number;

    totalPrice: number;
}

export interface OrderIF extends Document {

    orderNumber: string;

    user: string;

    items: OrderItemIF[];

    shippingAddress: AddressIF;

    paymentMethod: PaymentMethod;

    paymentStatus: PaymentStatus;

    paymentId?: string;

    subtotal: number;

    discountAmount: number;

    couponCode?: string;

    couponDiscount?: number;

    shippingCharge: number;

    taxAmount: number;

    totalAmount: number;

    totalItems: number;

    status: OrderStatus;

    trackingNumber?: string;

    courier?: string;

    estimatedDelivery?: Date;

    deliveredAt?: Date;

    cancelledAt?: Date;

    cancellationReason?: string;

    notes?: string;

    isDeleted: boolean;

    _id: string

    createdAt: Date

    updatedAt: Date
}

export interface OrderCustomerIF {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export interface OrderSellerIF {
    _id: string;
    shopName: string;
    vendorId: string;
}

export interface AdminOrderIF extends Omit<OrderIF, "user"> {
    user: OrderCustomerIF | null;
    sellers: OrderSellerIF[];
}


