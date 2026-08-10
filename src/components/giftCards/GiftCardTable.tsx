// src/components/giftCards/GiftCardTable.tsx
import { format } from "date-fns";
import { Ban, CheckCircle2, Trash2, Gift } from "lucide-react";
import type { GiftCardIF } from "../../interface/data/giftCard";
import { GiftCardStatus } from "../../enums/giftCard.enum";
import RestorePermanentActions from "../common/RestorePermanentActions";

interface GiftCardTableProps {
  giftCards: GiftCardIF[];
  trashView?: boolean;
  onToggle: (giftCard: GiftCardIF) => void;
  onDelete: (giftCard: GiftCardIF) => void;
  onRestore: (giftCard: GiftCardIF) => void;
  onPermanentDelete: (giftCard: GiftCardIF) => void;
}

const STATUS_STYLES: Record<string, string> = {
  [GiftCardStatus.ACTIVE]: "bg-green-100 text-green-700",
  [GiftCardStatus.REDEEMED]: "bg-gray-100 text-gray-600",
  [GiftCardStatus.EXPIRED]: "bg-red-100 text-red-700",
  [GiftCardStatus.DISABLED]: "bg-amber-100 text-amber-700",
};

const GiftCardTable = ({ giftCards, trashView = false, onToggle, onDelete, onRestore, onPermanentDelete }: GiftCardTableProps) => {
  if (giftCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
          <Gift className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {trashView ? "No deleted gift cards" : "No gift cards found"}
        </p>
        {trashView && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Deleted gift cards will show up here.</p>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Code</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Balance</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Redeemed by</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Expiry</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {giftCards.map((gc) => (
            <tr key={gc._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <span className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>{gc.code}</span>
              </td>
              <td className="py-3" style={{ color: "var(--text-primary)" }}>
                ₹{gc.balance.toLocaleString()} <span className="text-xs" style={{ color: "var(--text-muted)" }}>/ ₹{gc.initialBalance.toLocaleString()}</span>
              </td>
              <td className="py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[gc.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {gc.status}
                </span>
              </td>
              <td className="py-3" style={{ color: "var(--text-secondary)" }}>{gc.redeemedBy?.length ?? 0}</td>
              <td className="py-3 text-xs" style={{ color: new Date(gc.expiryDate) < new Date() ? "var(--error)" : "var(--text-secondary)" }}>
                {format(new Date(gc.expiryDate), "MMM d, yyyy")}
              </td>
              <td className="py-3">
                {trashView ? (
                  <RestorePermanentActions onRestore={() => onRestore(gc)} onPermanentDelete={() => onPermanentDelete(gc)} />
                ) : (
                  <div className="flex justify-end gap-1.5">
                    {gc.status !== GiftCardStatus.REDEEMED && (
                      <button
                        onClick={() => onToggle(gc)}
                        title={gc.status === GiftCardStatus.DISABLED ? "Activate" : "Disable"}
                        className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer"
                      >
                        {gc.status === GiftCardStatus.DISABLED
                          ? <CheckCircle2 className="h-4 w-4" style={{ color: "var(--success)" }} />
                          : <Ban className="h-4 w-4" style={{ color: "var(--warning)" }} />}
                      </button>
                    )}
                    <button onClick={() => onDelete(gc)} title="Delete" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                      <Trash2 className="h-4 w-4" style={{ color: "var(--error)" }} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GiftCardTable;