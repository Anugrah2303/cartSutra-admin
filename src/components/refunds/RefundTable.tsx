// src/components/refunds/RefundTable.tsx
import { format } from "date-fns";
import { RotateCcw, XCircle, Receipt } from "lucide-react";
import RefundStatusBadge from "./RefundStatusBadge";
import { REFUND_SOURCE_LABELS } from "./refundStyles";
import { RefundStatus } from "../../enums/refund.enum";
import type { RefundIF } from "../../interface/data/refund";

interface RefundTableProps {
  refunds: RefundIF[];
  onProcess: (refund: RefundIF) => void;
  onRetry: (refund: RefundIF) => void;
  onCancel: (refund: RefundIF) => void;
}

const RefundTable = ({ refunds, onProcess, onRetry, onCancel }: RefundTableProps) => {
  if (refunds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
          <Receipt className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No refunds found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Refund</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Order</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Source</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Amount</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Method</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Date</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map((refund) => (
            <tr key={refund._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>#{refund.refundNumber}</span>
                {refund.failureReason && (
                  <p className="text-xs mt-0.5 max-w-40 truncate" style={{ color: "var(--error)" }} title={refund.failureReason}>{refund.failureReason}</p>
                )}
              </td>
              <td className="py-3" style={{ color: "var(--text-secondary)" }}>#{refund.orderNumber}</td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{REFUND_SOURCE_LABELS[refund.source] ?? refund.source}</td>
              <td className="py-3 font-medium" style={{ color: "var(--text-primary)" }}>₹{refund.amount.toLocaleString()}</td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{refund.method.replace(/_/g, " ")}</td>
              <td className="py-3"><RefundStatusBadge status={refund.status} /></td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{format(new Date(refund.createdAt), "MMM d, yyyy")}</td>
              <td className="py-3">
                <div className="flex justify-end gap-1.5">
                  {refund.status === RefundStatus.PENDING && (
                    <>
                      <button onClick={() => onProcess(refund)} title="Process refund" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                        <RotateCcw className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                      </button>
                      <button onClick={() => onCancel(refund)} title="Cancel refund" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                        <XCircle className="h-4 w-4" style={{ color: "var(--error)" }} />
                      </button>
                    </>
                  )}
                  {refund.status === RefundStatus.FAILED && (
                    <button onClick={() => onRetry(refund)} title="Retry refund" className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs cursor-pointer hover:bg-(--bg-soft)" style={{ color: "var(--color-primary)" }}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Retry
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RefundTable;