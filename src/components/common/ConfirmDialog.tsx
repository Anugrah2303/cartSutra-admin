// src/components/common/ConfirmDialog.tsx
import Modal from "./Modal";
import Button from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  loading?: boolean;
  confirmLabel?: string;
  loadingLabel?: string;
  variant?: "danger" | "primary" | "success";
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  description,
  loading,
  confirmLabel = "Delete",
  loadingLabel,
  variant = "danger",
  onConfirm,
  onClose,
}: ConfirmDialogProps) => (
  <Modal open={open} title={title} onClose={onClose} maxWidth="max-w-sm">
    <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{description}</p>
    <div className="flex justify-end gap-3">
      <Button value="Cancel" variant="secondary" onClick={onClose} />
      <Button
        value={loading ? (loadingLabel ?? (confirmLabel === "Delete" ? "Deleting..." : `${confirmLabel}...`)) : confirmLabel}
        variant={variant}
        disable={loading}
        onClick={onConfirm}
      />
    </div>
  </Modal>
);

export default ConfirmDialog;