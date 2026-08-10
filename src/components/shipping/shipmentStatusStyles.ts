import { ShipmentStatus, ShippingCarrier } from "../../enums/shipment.enum";

export const SHIPMENT_STATUS_STYLES: Record<string, string> = {
    [ShipmentStatus.PENDING]: "bg-amber-100 text-amber-700",
    [ShipmentStatus.PACKED]: "bg-indigo-100 text-indigo-700",
    [ShipmentStatus.SHIPPED]: "bg-blue-100 text-blue-700",
    [ShipmentStatus.IN_TRANSIT]: "bg-teal-100 text-teal-700",
    [ShipmentStatus.OUT_FOR_DELIVERY]: "bg-teal-100 text-teal-700",
    [ShipmentStatus.DELIVERED]: "bg-green-100 text-green-700",
    [ShipmentStatus.FAILED_DELIVERY]: "bg-red-100 text-red-700",
    [ShipmentStatus.RETURNED_TO_ORIGIN]: "bg-orange-100 text-orange-700",
    [ShipmentStatus.CANCELLED]: "bg-gray-100 text-gray-600",
};

// Mirrors backend's shipmentStatusFlow in shipment.controller.ts — used only to
// disable obviously-backward selections in the UI. Backend is the source of truth.
export const SHIPMENT_STATUS_FLOW: ShipmentStatus[] = [
    ShipmentStatus.PENDING,
    ShipmentStatus.PACKED,
    ShipmentStatus.SHIPPED,
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.OUT_FOR_DELIVERY,
    ShipmentStatus.DELIVERED,
];

// backend rejects setting status back to PENDING manually (see updateShipmentStatusValidator)
export const SHIPMENT_STATUS_OPTIONS = Object.values(ShipmentStatus).filter((s) => s !== ShipmentStatus.PENDING);

export const CANCELLABLE_STATUSES = [ShipmentStatus.PENDING, ShipmentStatus.PACKED];
export const TERMINAL_STATUSES = [ShipmentStatus.DELIVERED, ShipmentStatus.CANCELLED, ShipmentStatus.RETURNED_TO_ORIGIN];

export const CARRIER_OPTIONS = Object.values(ShippingCarrier);