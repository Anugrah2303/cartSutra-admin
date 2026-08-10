// src/components/orders/OrderDetailModal.tsx
import { useRef, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import Modal from "../common/Modal";
import Button from "../common/Button";
import DetailRow from "../vendors/DetailRow";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { ORDER_STATUS_OPTIONS } from "./orderStatusStyles";
import { useUpdateOrderStatus } from "../../hooks/queries/order.queries";
import { OrderStatus } from "../../enums/order.enum";
import type { AdminOrderIF } from "../../interface/data/order";

interface OrderDetailModalProps {
  order: AdminOrderIF | null;
  onClose: () => void;
}

const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => {
  const updateStatus = useUpdateOrderStatus();

  // ── reset local form state whenever the order changes, without an effect ──
  // (React docs: "Adjusting state when a prop changes")
  const [nextStatus, setNextStatus] = useState<string>("");
  const [cancellationReason, setCancellationReason] = useState("");
  const prevOrderIdRef = useRef<string | null>(null);

  const currentOrderId = order?._id ?? null;
  if (prevOrderIdRef.current !== currentOrderId) {
    prevOrderIdRef.current = currentOrderId;
    setNextStatus(order?.status ?? "");
    setCancellationReason("");
  }

  if (!order) return null;

  const uniqueSellers = Array.from(new Map(order.sellers.map((s) => [s._id, s])).values());
  const statusChanged = nextStatus !== order.status;

  const handleUpdateStatus = () => {
    if (nextStatus === OrderStatus.CANCELLED && cancellationReason.trim().length < 3) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    updateStatus.mutate(
      { id: order._id, status: nextStatus as OrderStatus, cancellationReason: cancellationReason.trim() || undefined },
      {
        onSuccess: () => toast.success("Order status updated"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <Modal open={!!order} title={`Order #${order.orderNumber}`} onClose={onClose} maxWidth="max-w-3xl">
      <div className="flex flex-col gap-6">

        <div className="flex flex-wrap items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Placed {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>

        {order.cancellationReason && (
          <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--error)", backgroundColor: "var(--bg-soft)", color: "var(--error)" }}>
            <strong>Cancellation reason:</strong> {order.cancellationReason}
          </div>
        )}

        {/* Customer & shipping */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>CUSTOMER</p>
            {order.user ? (
              <>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>{order.user.firstName} {order.user.lastName}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{order.user.email}</p>
                {order.user.phone && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{order.user.phone}</p>}
              </>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Deleted user</p>
            )}
          </div>

          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>SHIPPING ADDRESS</p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{order.shippingAddress.fullName}</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{order.shippingAddress.phone}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              {order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
              {order.shippingAddress.landmark ? `, near ${order.shippingAddress.landmark}` : ""}
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Items */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>ITEMS ({order.items.length})</p>
          <div className="flex flex-col gap-2">
            {order.items.map((item, idx) => (
              <div key={`${item.product}-${idx}`} className="flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "var(--border-light)" }}>
                <img src={item.thumbnail} alt={item.title} className="h-12 w-12 rounded-md object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {item.variant ? `SKU: ${item.variant} · ` : ""}Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <p className="text-sm font-medium shrink-0" style={{ color: "var(--text-primary)" }}>₹{item.totalPrice.toLocaleString()}</p>
              </div>
            ))}
          </div>
          {uniqueSellers.length > 0 && (
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              Fulfilled by: {uniqueSellers.map((s) => s.shopName).join(", ")}
            </p>
          )}
        </div>

        {/* Payment breakdown */}
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>PAYMENT</p>
          <DetailRow label="Method" value={order.paymentMethod} />
          {order.paymentId && <DetailRow label="Payment ID" value={order.paymentId} />}
          <DetailRow label="Subtotal" value={`₹${order.subtotal.toLocaleString()}`} />
          {order.discountAmount > 0 && <DetailRow label="Product discount" value={`- ₹${order.discountAmount.toLocaleString()}`} />}
          {!!order.couponCode && <DetailRow label={`Coupon (${order.couponCode})`} value={`- ₹${(order.couponDiscount ?? 0).toLocaleString()}`} />}
          <DetailRow label="Shipping" value={order.shippingCharge === 0 ? "Free" : `₹${order.shippingCharge}`} />
          <DetailRow label="Tax" value={`₹${order.taxAmount.toLocaleString()}`} />
          <div className="mt-1 pt-2 flex justify-between text-sm font-semibold" style={{ borderTop: "1px solid var(--border-light)", color: "var(--text-primary)" }}>
            <span>Total</span>
            <span>₹{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Tracking */}
        {(order.trackingNumber || order.courier || order.estimatedDelivery || order.deliveredAt) && (
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>SHIPMENT</p>
            {order.courier && <DetailRow label="Courier" value={order.courier} />}
            {order.trackingNumber && <DetailRow label="Tracking number" value={order.trackingNumber} />}
            {order.estimatedDelivery && <DetailRow label="Estimated delivery" value={format(new Date(order.estimatedDelivery), "MMM d, yyyy")} />}
            {order.deliveredAt && <DetailRow label="Delivered at" value={format(new Date(order.deliveredAt), "MMM d, yyyy 'at' h:mm a")} />}
          </div>
        )}

        {order.notes && (
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>NOTES</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{order.notes}</p>
          </div>
        )}

        {/* Update status */}
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>UPDATE STATUS</p>

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-40">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>New status</label>
              <select
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value)}
                className="w-full mt-1 rounded-md border px-3 py-2 text-sm capitalize"
                style={{ borderColor: "var(--border-light)" }}
              >
                {ORDER_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ").toLowerCase()}</option>
                ))}
              </select>
            </div>

            <Button
              value={updateStatus.isPending ? "Updating..." : "Update status"}
              disable={!statusChanged || updateStatus.isPending}
              onClick={handleUpdateStatus}
            />
          </div>

          {nextStatus === OrderStatus.CANCELLED && statusChanged && (
            <div className="mt-3">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Cancellation reason</label>
              <textarea
                rows={2}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="e.g. Out of stock, customer requested cancellation..."
                className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
              />
            </div>
          )}

          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Note: statuses can only move forward in the standard flow (Pending → ... → Delivered). Cancel is available separately.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;