// src/components/refunds/RefundStatusBadge.tsx
import { REFUND_STATUS_STYLES } from "./refundStyles";

const RefundStatusBadge = ({ status }: { status: string }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${REFUND_STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
    {status}
  </span>
);

export default RefundStatusBadge;