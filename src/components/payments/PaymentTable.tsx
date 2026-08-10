import { format } from "date-fns";
import { RotateCcw, Receipt } from "lucide-react";
import PaymentStatusBadge from "../orders/PaymentStatusBadge";
import type { AdminOrderIF } from "../../interface/data/order";
import { PaymentStatus } from "../../enums/order.enum";

interface PaymentTableProps {
  orders: AdminOrderIF[];
  onRefund: (order: AdminOrderIF) => void;
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
      <Receipt className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
    </div>
    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No payments found</p>
    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Try adjusting your filters.</p>
  </div>
);

const PaymentTable = ({ orders, onRefund }: PaymentTableProps) => {
  if (orders.length === 0) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Order</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Customer</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Method</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Payment ID</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Amount</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Date</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3 font-medium" style={{ color: "var(--text-primary)" }}>#{order.orderNumber}</td>
              <td className="py-3">
                {order.user ? (
                  <>
                    <p style={{ color: "var(--text-primary)" }}>{order.user.firstName} {order.user.lastName}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{order.user.email}</p>
                  </>
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>Deleted user</span>
                )}
              </td>
              <td className="py-3" style={{ color: "var(--text-secondary)" }}>{order.paymentMethod}</td>
              <td className="py-3">
                {order.paymentId ? <code className="text-xs">{order.paymentId}</code> : <span style={{ color: "var(--text-muted)" }}>—</span>}
              </td>
              <td className="py-3 font-medium" style={{ color: "var(--text-primary)" }}>₹{order.totalAmount.toLocaleString()}</td>
              <td className="py-3"><PaymentStatusBadge status={order.paymentStatus} /></td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{format(new Date(order.createdAt), "MMM d, yyyy")}</td>
              <td className="py-3">
                <div className="flex justify-end">
                  {order.paymentStatus === PaymentStatus.PAID && (
                    <button onClick={() => onRefund(order)} title="Refund payment" className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs cursor-pointer hover:bg-(--bg-soft)" style={{ color: "var(--error)" }}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Refund
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;