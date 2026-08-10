// src/components/payouts/PayoutStatusBadge.tsx
import { PAYOUT_STATUS_STYLES } from "./payoutStyles";

const PayoutStatusBadge = ({ status }: { status: string }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${PAYOUT_STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
    {status}
  </span>
);

export default PayoutStatusBadge;