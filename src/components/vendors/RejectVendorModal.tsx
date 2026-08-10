import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";

interface RejectVendorModalProps {
  open: boolean;
  shopName?: string;
  loading?: boolean;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const RejectVendorModal = ({ open, shopName, loading, onConfirm, onClose }: RejectVendorModalProps) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim().length < 5) return;
    onConfirm(reason.trim());
    setReason("");
  };

  return (
    <Modal open={open} title={`Reject "${shopName}"`} onClose={onClose} maxWidth="max-w-md">
      <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
        Provide a reason — this will be visible to the vendor.
      </p>
      <textarea
        rows={3}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="e.g. Incomplete KYC documents, invalid GST number..."
        className="w-full rounded-md border px-3 py-2 text-sm outline-none"
        style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
      />
      {reason.trim().length > 0 && reason.trim().length < 5 && (
        <p className="text-xs mt-1 text-(--error)">Reason must be at least 5 characters</p>
      )}
      <div className="flex justify-end gap-3 mt-4">
        <Button value="Cancel" variant="secondary" onClick={onClose} />
        <Button value={loading ? "Rejecting..." : "Reject vendor"} variant="danger" disable={loading || reason.trim().length < 5} onClick={handleConfirm} />
      </div>
    </Modal>
  );
};

export default RejectVendorModal;