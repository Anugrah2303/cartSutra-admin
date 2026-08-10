import type { ShipmentStatus, ShippingCarrier } from "../../enums/shipment.enum";
import type { AddressIF } from "./address";

export interface ShipmentItemIF {
    product: string;
    variant?: string | null;
    title: string;
    thumbnail: string;
    quantity: number;
}

export interface TrackingEventIF {
    status: ShipmentStatus;
    location?: string;
    description?: string;
    occurredAt: string;
    updatedBy: string;
}

export interface ShipmentIF {
    _id: string;

    shipmentNumber: string;

    order: string;
    orderNumber: string;

    vendor: string;

    items: ShipmentItemIF[];

    shippingAddress: AddressIF;

    carrier: ShippingCarrier;
    trackingNumber?: string | null;
    trackingUrl?: string | null;

    status: ShipmentStatus;

    weight?: number | null;
    shippingCost?: number | null;

    estimatedDelivery?: string | null;
    shippedAt?: string | null;
    deliveredAt?: string | null;
    failedAt?: string | null;
    failureReason?: string | null;

    events: TrackingEventIF[];

    isDeleted: boolean;

    createdAt: string;
    updatedAt: string;
}