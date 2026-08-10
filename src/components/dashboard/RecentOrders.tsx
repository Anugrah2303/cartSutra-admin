import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import { OrderStatus } from "../../enums/order.enum";
import type { RecentOrderIF } from "../../interface/data/dashboard";

const STATUS_STYLES: Record<string, string> = {
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

const RecentOrders = ({ orders }: { orders: RecentOrderIF[] }) => {
  const navigate = useNavigate();

  return (
    <Card
      title="Recent orders"
      action={
        <button onClick={() => navigate("/admin/orders")} className="text-xs font-medium cursor-pointer" style={{ color: "var(--color-primary)" }}>
          View all
        </button>
      }
    >
      {orders.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No recent orders.</p>
      ) : (
        <div className="flex flex-col divide-y" style={{ borderColor: "var(--border-light)" }}>
          {orders.map((order) => (
            <div key={order._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>#{order.orderNumber}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {order.customerName} · {format(new Date(order.createdAt), "MMM d, h:mm a")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>₹{order.totalAmount.toLocaleString()}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentOrders;