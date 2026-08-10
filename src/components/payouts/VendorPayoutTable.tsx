// src/components/payouts/VendorPayoutTable.tsx
import { format } from "date-fns";
import { CheckCircle2, XCircle, Wallet } from "lucide-react";
import PayoutStatusBadge from "./PayoutStatusBadge";
import { PayoutStatus } from "../../enums/payout.enum";
import type { PayoutIF } from "../../interface/data/payout";

interface VendorPayoutTableProps {
  payouts: PayoutIF[];
  onProcess: (payout: PayoutIF) => void;
  onReject: (payout: PayoutIF) => void;
}

const VendorPayoutTable = ({ payouts, onProcess, onReject }: VendorPayoutTableProps) => {
  if (payouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
          <Wallet className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No payout requests found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Payout</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Vendor</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Amount</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Method</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Requested</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout) => (
            <tr key={payout._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>#{payout.payoutNumber}</span>
                {payout.transactionRef && <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ref: {payout.transactionRef}</p>}
                {payout.rejectionReason && <p className="text-xs mt-0.5 max-w-40 truncate" style={{ color: "var(--error)" }} title={payout.rejectionReason}>{payout.rejectionReason}</p>}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  {payout.vendorDetails?.shopLogo?.URL ? (
                    <img src={payout.vendorDetails.shopLogo.URL} alt={payout.vendorDetails.shopName} className="h-8 w-8 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold text-white" style={{ background: "var(--gradient-primary)" }}>
                      {payout.vendorDetails?.shopName?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <span style={{ color: "var(--text-primary)" }}>{payout.vendorDetails?.shopName ?? "Unknown vendor"}</span>
                </div>
              </td>
              <td className="py-3 font-medium" style={{ color: "var(--text-primary)" }}>₹{payout.amount.toLocaleString()}</td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{payout.method.replace(/_/g, " ")}</td>
              <td className="py-3"><PayoutStatusBadge status={payout.status} /></td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{format(new Date(payout.requestedAt), "MMM d, yyyy")}</td>
              <td className="py-3">
                {payout.status === PayoutStatus.PENDING && (
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => onProcess(payout)} title="Process payout" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                      <CheckCircle2 className="h-4 w-4" style={{ color: "var(--success)" }} />
                    </button>
                    <button onClick={() => onReject(payout)} title="Reject payout" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                      <XCircle className="h-4 w-4" style={{ color: "var(--error)" }} />
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

export default VendorPayoutTable;