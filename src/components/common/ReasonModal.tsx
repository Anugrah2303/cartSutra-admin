import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface ReasonModalProps {
  open: boolean;
  title: string;
  description?: string;
  label: string;
  placeholder?: string;
  confirmLabel?: string;
  minLength?: number;
  multiline?: boolean;
  loading?: boolean;
  variant?: "primary" | "danger" | "success";
  onConfirm: (value: string) => void;
  onClose: () => void;
}

const ReasonModal = ({
  open,
  title,
  description,
  label,
  placeholder,
  confirmLabel = "Confirm",
  minLength = 5,
  multiline = true,
  loading,
  variant = "danger",
  onConfirm,
  onClose,
}: ReasonModalProps) => {
  const [value, setValue] = useState("");

  const handleConfirm = () => {
    if (value.trim().length < minLength) return;
    onConfirm(value.trim());
    setValue("");
  };

  const handleClose = () => {
    setValue("");
    onClose();
  };

  return (
    <Modal open={open} title={title} onClose={handleClose} maxWidth="max-w-md">
      {description && <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{description}</p>}
      <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
        />
      )}
      {value.trim().length > 0 && value.trim().length < minLength && (
        <p className="text-xs mt-1 text-(--error)">Must be at least {minLength} characters</p>
      )}
      <div className="flex justify-end gap-3 mt-4">
        <Button value="Cancel" variant="secondary" onClick={handleClose} />
        <Button value={loading ? "Saving..." : confirmLabel} variant={variant} disable={loading || value.trim().length < minLength} onClick={handleConfirm} />
      </div>
    </Modal>
  );
};

export default ReasonModal;