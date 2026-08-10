import { useRef, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import Modal from "../common/Modal";
import Button from "../common/Button";
import DetailRow from "../vendors/DetailRow";
import ShipmentStatusBadge from "./ShipmentStatusBadge";
import { SHIPMENT_STATUS_OPTIONS, CARRIER_OPTIONS, CANCELLABLE_STATUSES, TERMINAL_STATUSES } from "./shipmentStatusStyles";
import { useUpdateShipmentStatus, useAssignCourier, useCancelShipment } from "../../hooks/queries/shipment.queries";
import { ShipmentStatus, ShippingCarrier } from "../../enums/shipment.enum";
import type { ShipmentIF } from "../../interface/data/shipment";

interface ShipmentDetailModalProps {
  shipment: ShipmentIF | null;
  onClose: () => void;
}

const ShipmentDetailModal = ({ shipment, onClose }: ShipmentDetailModalProps) => {
  const updateStatus = useUpdateShipmentStatus();
  const assignCourier = useAssignCourier();
  const cancelShipment = useCancelShipment();

  const [nextStatus, setNextStatus] = useState<string>("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [failureReason, setFailureReason] = useState("");

  const [carrier, setCarrier] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  const [confirmingCancel, setConfirmingCancel] = useState(false);

  // ── reset local form state whenever the shipment changes, without an effect ──
  const prevShipmentIdRef = useRef<string | null>(null);
  const currentShipmentId = shipment?._id ?? null;

  if (prevShipmentIdRef.current !== currentShipmentId) {
    prevShipmentIdRef.current = currentShipmentId;
    setNextStatus(shipment?.status ?? "");
    setLocation("");
    setDescription("");
    setFailureReason("");
    setCarrier(shipment?.carrier ?? "");
    setTrackingNumber(shipment?.trackingNumber ?? "");
    setTrackingUrl(shipment?.trackingUrl ?? "");
    setConfirmingCancel(false);
  }

  if (!shipment) return null;

  const statusChanged = nextStatus !== shipment.status;
  const isTerminal = TERMINAL_STATUSES.includes(shipment.status);
  const isCancellable = CANCELLABLE_STATUSES.includes(shipment.status);

  const courierChanged =
    carrier !== shipment.carrier ||
    trackingNumber !== (shipment.trackingNumber ?? "") ||
    trackingUrl !== (shipment.trackingUrl ?? "");

  const handleUpdateStatus = () => {
    if (nextStatus === ShipmentStatus.FAILED_DELIVERY && failureReason.trim().length < 3) {
      toast.error("Please provide a failure reason");
      return;
    }

    updateStatus.mutate(
      {
        id: shipment._id,
        status: nextStatus as ShipmentStatus,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
        failureReason: failureReason.trim() || undefined,
      },
      {
        onSuccess: () => toast.success("Shipment status updated"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleAssignCourier = () => {
    if (!trackingNumber.trim()) {
      toast.error("Tracking number is required");
      return;
    }

    assignCourier.mutate(
      { id: shipment._id, carrier: carrier as ShippingCarrier, trackingNumber: trackingNumber.trim(), trackingUrl: trackingUrl.trim() || undefined },
      {
        onSuccess: () => toast.success("Courier details updated"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleCancel = () => {
    cancelShipment.mutate(shipment._id, {
      onSuccess: () => { toast.success("Shipment cancelled"); setConfirmingCancel(false); onClose(); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Modal open={!!shipment} title={`Shipment #${shipment.shipmentNumber}`} onClose={onClose} maxWidth="max-w-3xl">
      <div className="flex flex-col gap-6">

        <div className="flex flex-wrap items-center gap-3">
          <ShipmentStatusBadge status={shipment.status} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            for order <strong style={{ color: "var(--text-secondary)" }}>#{shipment.orderNumber}</strong>
          </span>
        </div>

        {shipment.failureReason && (
          <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--error)", backgroundColor: "var(--bg-soft)", color: "var(--error)" }}>
            <strong>Failure reason:</strong> {shipment.failureReason}
          </div>
        )}

        {/* Shipping address */}
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>SHIPPING ADDRESS</p>
          <p className="text-sm" style={{ color: "var(--text-primary)" }}>{shipment.shippingAddress.fullName}</p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{shipment.shippingAddress.phone}</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            {shipment.shippingAddress.addressLine1}{shipment.shippingAddress.addressLine2 ? `, ${shipment.shippingAddress.addressLine2}` : ""}
          </p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {shipment.shippingAddress.city}, {shipment.shippingAddress.state} {shipment.shippingAddress.postalCode}, {shipment.shippingAddress.country}
          </p>
        </div>

        {/* Items */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>ITEMS ({shipment.items.length})</p>
          <div className="flex flex-col gap-2">
            {shipment.items.map((item, idx) => (
              <div key={`${item.product}-${idx}`} className="flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "var(--border-light)" }}>
                <img src={item.thumbnail} alt={item.title} className="h-12 w-12 rounded-md object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {item.variant ? `SKU: ${item.variant} · ` : ""}Qty: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipment info */}
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>SHIPMENT INFO</p>
          <DetailRow label="Carrier" value={shipment.carrier.replace(/_/g, " ")} />
          <DetailRow label="Tracking number" value={shipment.trackingNumber} />
          {shipment.trackingUrl && (
            <div className="flex justify-between py-2 text-sm">
              <span style={{ color: "var(--text-muted)" }}>Tracking URL</span>
              <a href={shipment.trackingUrl} target="_blank" rel="noreferrer" className="truncate max-w-[60%]" style={{ color: "var(--color-primary)" }}>{shipment.trackingUrl}</a>
            </div>
          )}
          <DetailRow label="Weight" value={shipment.weight ? `${shipment.weight} kg` : undefined} />
          <DetailRow label="Shipping cost" value={shipment.shippingCost ? `₹${shipment.shippingCost}` : undefined} />
          <DetailRow label="Estimated delivery" value={shipment.estimatedDelivery ? format(new Date(shipment.estimatedDelivery), "MMM d, yyyy") : undefined} />
          {shipment.shippedAt && <DetailRow label="Shipped at" value={format(new Date(shipment.shippedAt), "MMM d, yyyy 'at' h:mm a")} />}
          {shipment.deliveredAt && <DetailRow label="Delivered at" value={format(new Date(shipment.deliveredAt), "MMM d, yyyy 'at' h:mm a")} />}
        </div>

        {/* Tracking events timeline */}
        {shipment.events.length > 0 && (
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>TRACKING TIMELINE</p>
            <div className="flex flex-col gap-3">
              {[...shipment.events].reverse().map((event, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "var(--color-primary)" }} />
                    {idx !== shipment.events.length - 1 && <span className="w-px flex-1 mt-1" style={{ backgroundColor: "var(--border-light)" }} />}
                  </div>
                  <div className="pb-3">
                    <ShipmentStatusBadge status={event.status} />
                    {event.location && <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{event.location}</p>}
                    {event.description && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{event.description}</p>}
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{format(new Date(event.occurredAt), "MMM d, yyyy 'at' h:mm a")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assign / update courier */}
        {!isTerminal && (
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>COURIER DETAILS</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Carrier</label>
                <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm capitalize" style={{ borderColor: "var(--border-light)" }}>
                  {CARRIER_OPTIONS.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Tracking number</label>
                <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Tracking URL (optional)</label>
                <input type="text" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }} />
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <Button value={assignCourier.isPending ? "Saving..." : "Save courier details"} disable={!courierChanged || assignCourier.isPending} onClick={handleAssignCourier} />
            </div>
          </div>
        )}

        {!isTerminal && (
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>UPDATE STATUS</p>

            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-40">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>New status</label>
                <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm capitalize" style={{ borderColor: "var(--border-light)" }}>
                  {SHIPMENT_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ").toLowerCase()}</option>
                  ))}
                </select>
              </div>

              <Button value={updateStatus.isPending ? "Updating..." : "Update status"} disable={!statusChanged || updateStatus.isPending} onClick={handleUpdateStatus} />
            </div>

            {statusChanged && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-3">
                <div>
                  <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Location (optional)</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mumbai hub" className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Description (optional)</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Departed origin facility" className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }} />
                </div>
              </div>
            )}

            {nextStatus === ShipmentStatus.FAILED_DELIVERY && statusChanged && (
              <div className="mt-3">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Failure reason *</label>
                <textarea rows={2} value={failureReason} onChange={(e) => setFailureReason(e.target.value)} placeholder="e.g. Customer unavailable, wrong address..." className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }} />
              </div>
            )}

            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              Note: statuses in the standard flow (Pending → ... → Delivered) can only move forward.
            </p>
          </div>
        )}

        {/* Cancel */}
        {isCancellable && (
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--error)", backgroundColor: "var(--bg-soft)" }}>
            {!confirmingCancel ? (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>This shipment hasn't been dispatched yet — it can still be cancelled.</p>
                <Button value="Cancel shipment" variant="danger" onClick={() => setConfirmingCancel(true)} />
              </div>
            ) : (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm font-medium" style={{ color: "var(--error)" }}>Are you sure you want to cancel this shipment?</p>
                <div className="flex gap-2">
                  <Button value="No, keep it" variant="secondary" onClick={() => setConfirmingCancel(false)} />
                  <Button value={cancelShipment.isPending ? "Cancelling..." : "Yes, cancel"} variant="danger" disable={cancelShipment.isPending} onClick={handleCancel} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShipmentDetailModal;