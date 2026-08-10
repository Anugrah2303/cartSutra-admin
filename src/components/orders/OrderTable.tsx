import { format } from "date-fns";
import { Eye, PackageSearch } from "lucide-react";
import type { AdminOrderIF } from "../../interface/data/order";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface OrderTableProps {
  orders: AdminOrderIF[];
  onView: (order: AdminOrderIF) => void;
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
      <PackageSearch className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
    </div>
    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No orders found</p>
    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Try adjusting your filters.</p>
  </div>
);

const OrderTable = ({ orders, onView }: OrderTableProps) => {
  if (orders.length === 0) return <EmptyState />;

  return (
    <>
      {/* ── Desktop / tablet: table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Order</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Customer</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Items</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Total</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Payment</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Date</th>
              <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td className="py-3">
                  <button onClick={() => onView(order)} className="font-medium hover:underline cursor-pointer" style={{ color: "var(--text-primary)" }}>
                    #{order.orderNumber}
                  </button>
                  {order.trackingNumber && (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Trk: {order.trackingNumber}</p>
                  )}
                </td>

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

                <td className="py-3">
                  <div className="flex items-center -space-x-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <img
                        key={`${item.product}-${idx}`}
                        src={item.thumbnail}
                        alt={item.title}
                        title={item.title}
                        className="h-8 w-8 rounded-md border-2 object-cover"
                        style={{ borderColor: "var(--bg-card)" }}
                      />
                    ))}
                    {order.items.length > 3 && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-md border-2 text-[10px] font-medium" style={{ borderColor: "var(--bg-card)", backgroundColor: "var(--bg-soft)", color: "var(--text-secondary)" }}>
                        +{order.items.length - 3}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{order.totalItems} item(s)</p>
                </td>

                <td className="py-3 font-medium" style={{ color: "var(--text-primary)" }}>
                  ₹{order.totalAmount.toLocaleString()}
                </td>

                <td className="py-3">
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{order.paymentMethod}</p>
                </td>

                <td className="py-3"><OrderStatusBadge status={order.status} /></td>

                <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                  {format(new Date(order.createdAt), "MMM d, yyyy")}
                  <br />
                  {format(new Date(order.createdAt), "h:mm a")}
                </td>

                <td className="py-3">
                  <div className="flex justify-end">
                    <button onClick={() => onView(order)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer" title="View order">
                      <Eye className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile: cards ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {orders.map((order) => (
          <button
            key={order._id}
            onClick={() => onView(order)}
            className="text-left rounded-xl border p-4 cursor-pointer active:scale-[0.99] transition-transform"
            style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)" }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>#{order.orderNumber}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <p className="font-semibold text-sm whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
                ₹{order.totalAmount.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center -space-x-2">
                {order.items.slice(0, 4).map((item, idx) => (
                  <img
                    key={`${item.product}-${idx}`}
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-8 w-8 rounded-md border-2 object-cover"
                    style={{ borderColor: "var(--bg-card)" }}
                  />
                ))}
                {order.items.length > 4 && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-md border-2 text-[10px] font-medium" style={{ borderColor: "var(--bg-card)", backgroundColor: "var(--bg-soft)", color: "var(--text-secondary)" }}>
                    +{order.items.length - 4}
                  </span>
                )}
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{order.totalItems} item(s)</span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs truncate max-w-[55%]" style={{ color: "var(--text-secondary)" }}>
                {order.user ? `${order.user.firstName} ${order.user.lastName}` : "Deleted user"}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                <PaymentStatusBadge status={order.paymentStatus} />
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

export default OrderTable;