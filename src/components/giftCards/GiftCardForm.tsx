// src/components/giftCards/GiftCardForm.tsx
import { useState } from "react";
import Button from "../common/Button";

export interface GiftCardFormOutput {
  initialBalance: number;
  expiryDate: string;
  issuedTo?: string;
}

interface GiftCardFormProps {
  loading?: boolean;
  onSubmit: (data: GiftCardFormOutput) => void;
  onCancel: () => void;
}

const GiftCardForm = ({ loading, onSubmit, onCancel }: GiftCardFormProps) => {
  const [initialBalance, setInitialBalance] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [issuedTo, setIssuedTo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const balance = Number(initialBalance);

    if (!balance || balance <= 0) return setError("Initial balance must be greater than 0");
    if (!expiryDate) return setError("Expiry date is required");
    if (new Date(expiryDate) <= new Date()) return setError("Expiry date must be in the future");

    setError("");
    onSubmit({ initialBalance: balance, expiryDate, issuedTo: issuedTo.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Initial balance (₹) *</label>
        <input
          type="number"
          min={1}
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
        />
      </div>

      <div>
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Expiry date *</label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
        />
      </div>

      <div>
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Issue to user ID (optional)</label>
        <input
          type="text"
          value={issuedTo}
          onChange={(e) => setIssuedTo(e.target.value)}
          placeholder="Mongo user _id — leave blank for an unassigned card"
          className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
        />
      </div>

      {error && <p className="text-xs text-(--error)">{error}</p>}

      <div className="flex justify-end gap-3 mt-2">
        <Button value="Cancel" variant="secondary" onClick={onCancel} />
        <Button value={loading ? "Creating..." : "Create gift card"} type="submit" disable={loading} />
      </div>
    </form>
  );
};

export default GiftCardForm;