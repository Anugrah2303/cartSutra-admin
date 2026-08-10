import { useRef, useState } from "react";
import { toast } from "sonner";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { useRefundPayment } from "../../hooks/queries/payment.queries";
import type { AdminOrderIF } from "../../interface/data/order";

interface RefundPaymentModalProps {
  order: AdminOrderIF | null;
  onClose: () => void;
}

const RefundPaymentModal = ({ order, onClose }: RefundPaymentModalProps) => {
  const refundPayment = useRefundPayment();

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  // reset local state whenever a different order opens, without an effect
  const prevOrderIdRef = useRef<string | null>(null);
  const currentOrderId = order?._id ?? null;
  if (prevOrderIdRef.current !== currentOrderId) {
    prevOrderIdRef.current = currentOrderId;
    setAmount(order ? String(order.totalAmount) : "");
    setReason("");
  }

  if (!order) return null;

  const numericAmount = Number(amount);
  const isValid = numericAmount > 0 && numericAmount <= order.totalAmount;

  const handleConfirm = () => {
    if (!isValid) {
      toast.error(`Amount must be between ₹1 and ₹${order.totalAmount}`);
      return;
    }

    refundPayment.mutate(
      { id: order._id, amount: numericAmount, reason: reason.trim() || undefined },
      {
        onSuccess: () => { toast.success("Refund initiated"); onClose(); },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <Modal open={!!order} title={`Refund order #${order.orderNumber}`} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Paid via <strong>{order.paymentMethod}</strong> · Total ₹{order.totalAmount.toLocaleString()}
          {order.paymentId && <> · Payment ID: <code>{order.paymentId}</code></>}
        </p>

        <div>
          <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Refund amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={1}
            max={order.totalAmount}
            className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none"
            style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
          />
          {!isValid && amount !== "" && (
            <p className="text-xs mt-1 text-(--error)">Enter an amount up to ₹{order.totalAmount}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Reason (optional)</label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Customer requested cancellation, damaged item..."
            className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none"
            style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
          />
        </div>

        <div className="flex justify-end gap-3 mt-1">
          <Button value="Cancel" variant="secondary" onClick={onClose} />
          <Button value={refundPayment.isPending ? "Refunding..." : "Confirm refund"} variant="danger" disable={!isValid || refundPayment.isPending} onClick={handleConfirm} />
        </div>
      </div>
    </Modal>
  );
};

export default RefundPaymentModal;