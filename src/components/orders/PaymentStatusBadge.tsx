import { PAYMENT_STATUS_STYLES } from "./orderStatusStyles";

const PaymentStatusBadge = ({ status }: { status: string }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap capitalize ${PAYMENT_STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
    {status.replace(/_/g, " ").toLowerCase()}
  </span>
);

export default PaymentStatusBadge;