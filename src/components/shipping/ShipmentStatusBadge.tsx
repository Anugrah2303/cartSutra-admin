import { SHIPMENT_STATUS_STYLES } from "./shipmentStatusStyles";

const ShipmentStatusBadge = ({ status }: { status: string }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap capitalize ${SHIPMENT_STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
    {status.replace(/_/g, " ").toLowerCase()}
  </span>
);

export default ShipmentStatusBadge;