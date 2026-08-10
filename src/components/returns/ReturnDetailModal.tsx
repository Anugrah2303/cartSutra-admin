import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import Modal from "../common/Modal";
import Button from "../common/Button";
import DetailRow from "../vendors/DetailRow";
import ReturnStatusBadge from "./ReturnStatusBadge";
import {
  useGetReturnById,
  useApproveReturn,
  useRejectReturn,
  useSchedulePickup,
  useMarkPickedUp,
  useMarkReceived,
  useProcessReturnRefund,
} from "../../hooks/queries/return.queries";
import { ReturnStatus, RefundMethod } from "../../enums/return.enum";

interface ReturnDetailModalProps {
  returnId: string | null;
  onClose: () => void;
}

const REFUND_METHOD_OPTIONS = Object.values(RefundMethod);

const ReturnDetailModal = ({ returnId, onClose }: ReturnDetailModalProps) => {
  const { data, isLoading } = useGetReturnById(returnId);

  const approveReturn = useApproveReturn();
  const rejectReturn = useRejectReturn();
  const schedulePickup = useSchedulePickup();
  const markPickedUp = useMarkPickedUp();
  const markReceived = useMarkReceived();
  const processRefund = useProcessReturnRefund();

  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [refundMethod, setRefundMethod] = useState<RefundMethod>(RefundMethod.ORIGINAL_PAYMENT);

  const returnRequest = data?.data;

  if (!returnId) return null;

  const resetRejectState = () => { setRejecting(false); setRejectionReason(""); };

  const handleApprove = () => {
    approveReturn.mutate(returnId, {
      onSuccess: () => toast.success("Return approved"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleReject = () => {
    if (rejectionReason.trim().length < 5) {
      toast.error("Rejection reason must be at least 5 characters");
      return;
    }
    rejectReturn.mutate({ id: returnId, rejectionReason: rejectionReason.trim() }, {
      onSuccess: () => { toast.success("Return rejected"); resetRejectState(); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleSchedulePickup = () => {
    schedulePickup.mutate(returnId, {
      onSuccess: () => toast.success("Pickup scheduled"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleMarkPickedUp = () => {
    markPickedUp.mutate(returnId, {
      onSuccess: () => toast.success("Marked as picked up"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleMarkReceived = () => {
    markReceived.mutate(returnId, {
      onSuccess: () => toast.success("Marked as received — refund now pending"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleProcessRefund = () => {
    processRefund.mutate({ id: returnId, refundMethod }, {
      onSuccess: () => toast.success("Refund processed successfully"),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Modal open={!!returnId} title={returnRequest ? `Return #${returnRequest.returnNumber}` : "Loading return..."} onClose={onClose} maxWidth="max-w-2xl">
      {isLoading || !returnRequest ? (
        <p className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : (
        <div className="flex flex-col gap-6">

          <div className="flex flex-wrap items-center gap-3">
            <ReturnStatusBadge status={returnRequest.status} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              for order <strong style={{ color: "var(--text-secondary)" }}>#{returnRequest.orderNumber}</strong>
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Requested {format(new Date(returnRequest.requestedAt), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>

          {returnRequest.rejectionReason && (
            <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--error)", backgroundColor: "var(--bg-soft)", color: "var(--error)" }}>
              <strong>Reason:</strong> {returnRequest.rejectionReason}
            </div>
          )}

          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>ITEM</p>
            <div className="flex items-center gap-3">
              <img src={returnRequest.thumbnail} alt={returnRequest.title} className="h-14 w-14 rounded-md object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{returnRequest.title}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {returnRequest.variant ? `SKU: ${returnRequest.variant} · ` : ""}Qty: {returnRequest.quantity} × ₹{returnRequest.unitPrice}
                </p>
              </div>
              <p className="text-sm font-medium shrink-0" style={{ color: "var(--text-primary)" }}>₹{returnRequest.refundAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>REASON</p>
              <DetailRow label="Reason" value={returnRequest.reason.replace(/_/g, " ")} />
              {returnRequest.description && <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>{returnRequest.description}</p>}
              {returnRequest.images && returnRequest.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {returnRequest.images.map((img, i) => (
                    <a key={i} href={img.URL} target="_blank" rel="noreferrer">
                      <img src={img.URL} alt={`evidence-${i}`} className="h-14 w-14 rounded-md object-cover border" style={{ borderColor: "var(--border-light)" }} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>PICKUP ADDRESS</p>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>{returnRequest.pickupAddress.fullName}</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{returnRequest.pickupAddress.phone}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                {returnRequest.pickupAddress.addressLine1}{returnRequest.pickupAddress.addressLine2 ? `, ${returnRequest.pickupAddress.addressLine2}` : ""}
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {returnRequest.pickupAddress.city}, {returnRequest.pickupAddress.state} {returnRequest.pickupAddress.postalCode}, {returnRequest.pickupAddress.country}
              </p>
            </div>
          </div>

          {(returnRequest.approvedAt || returnRequest.pickupScheduledAt || returnRequest.pickedUpAt || returnRequest.receivedAt || returnRequest.refundedAt) && (
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>TIMELINE</p>
              {returnRequest.approvedAt && <DetailRow label="Approved" value={format(new Date(returnRequest.approvedAt), "MMM d, yyyy 'at' h:mm a")} />}
              {returnRequest.pickupScheduledAt && <DetailRow label="Pickup scheduled" value={format(new Date(returnRequest.pickupScheduledAt), "MMM d, yyyy 'at' h:mm a")} />}
              {returnRequest.pickedUpAt && <DetailRow label="Picked up" value={format(new Date(returnRequest.pickedUpAt), "MMM d, yyyy 'at' h:mm a")} />}
              {returnRequest.receivedAt && <DetailRow label="Received" value={format(new Date(returnRequest.receivedAt), "MMM d, yyyy 'at' h:mm a")} />}
              {returnRequest.refundedAt && <DetailRow label="Refunded" value={format(new Date(returnRequest.refundedAt), "MMM d, yyyy 'at' h:mm a")} />}
              {returnRequest.refundMethod && <DetailRow label="Refund method" value={returnRequest.refundMethod.replace(/_/g, " ")} />}
            </div>
          )}

          {/* action panel — one action set per status */}
          {returnRequest.status === ReturnStatus.REQUESTED && (
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>REVIEW REQUEST</p>
              {!rejecting ? (
                <div className="flex gap-3">
                  <Button value={approveReturn.isPending ? "Approving..." : "Approve"} variant="success" disable={approveReturn.isPending} onClick={handleApprove} />
                  <Button value="Reject" variant="danger" onClick={() => setRejecting(true)} />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Item does not match return policy..."
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
                  />
                  <div className="flex gap-3">
                    <Button value="Cancel" variant="secondary" onClick={resetRejectState} />
                    <Button value={rejectReturn.isPending ? "Rejecting..." : "Confirm reject"} variant="danger" disable={rejectReturn.isPending || rejectionReason.trim().length < 5} onClick={handleReject} />
                  </div>
                </div>
              )}
            </div>
          )}

          {returnRequest.status === ReturnStatus.APPROVED && (
            <div className="rounded-xl border p-4 flex items-center justify-between flex-wrap gap-2" style={{ borderColor: "var(--border-light)" }}>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Ready to schedule a pickup for this item.</p>
              <Button value={schedulePickup.isPending ? "Scheduling..." : "Schedule pickup"} disable={schedulePickup.isPending} onClick={handleSchedulePickup} />
            </div>
          )}

          {returnRequest.status === ReturnStatus.PICKUP_SCHEDULED && (
            <div className="rounded-xl border p-4 flex items-center justify-between flex-wrap gap-2" style={{ borderColor: "var(--border-light)" }}>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Pickup has been scheduled. Mark it once the courier collects the item.</p>
              <Button value={markPickedUp.isPending ? "Updating..." : "Mark picked up"} disable={markPickedUp.isPending} onClick={handleMarkPickedUp} />
            </div>
          )}

          {returnRequest.status === ReturnStatus.PICKED_UP && (
            <div className="rounded-xl border p-4 flex items-center justify-between flex-wrap gap-2" style={{ borderColor: "var(--border-light)" }}>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Confirm once the returned item has arrived at the warehouse.</p>
              <Button value={markReceived.isPending ? "Updating..." : "Mark received"} disable={markReceived.isPending} onClick={handleMarkReceived} />
            </div>
          )}

          {returnRequest.status === ReturnStatus.REFUND_PENDING && (
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>PROCESS REFUND</p>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-40">
                  <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Refund method</label>
                  <select value={refundMethod} onChange={(e) => setRefundMethod(e.target.value as RefundMethod)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
                    {REFUND_METHOD_OPTIONS.map((m) => <option key={m} value={m}>{m.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <Button value={processRefund.isPending ? "Processing..." : `Refund ₹${returnRequest.refundAmount.toLocaleString()}`} disable={processRefund.isPending} onClick={handleProcessRefund} />
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ReturnDetailModal;