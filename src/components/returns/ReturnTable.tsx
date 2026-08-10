import { format } from "date-fns";
import { Eye, RotateCcw } from "lucide-react";
import type { ReturnIF } from "../../interface/data/return";
import ReturnStatusBadge from "./ReturnStatusBadge";

const ReturnTable = ({ returns, onView }: { returns: ReturnIF[]; onView: (r: ReturnIF) => void }) => {
  if (returns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
          <RotateCcw className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No returns found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Return</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Item</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Reason</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Refund amount</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Requested</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((r) => (
            <tr key={r._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <button onClick={() => onView(r)} className="font-medium hover:underline cursor-pointer" style={{ color: "var(--text-primary)" }}>#{r.returnNumber}</button>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Order #{r.orderNumber}</p>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <img src={r.thumbnail} alt={r.title} className="h-8 w-8 rounded-md object-cover" />
                  <span className="truncate max-w-40" style={{ color: "var(--text-secondary)" }}>{r.title}</span>
                </div>
              </td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{r.reason.replace(/_/g, " ")}</td>
              <td className="py-3 font-medium" style={{ color: "var(--text-primary)" }}>₹{r.refundAmount.toLocaleString()}</td>
              <td className="py-3"><ReturnStatusBadge status={r.status} /></td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{format(new Date(r.requestedAt), "MMM d, yyyy")}</td>
              <td className="py-3">
                <div className="flex justify-end">
                  <button onClick={() => onView(r)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                    <Eye className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnTable;