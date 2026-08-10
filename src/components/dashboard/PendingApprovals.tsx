import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import type { PendingApprovalIF } from "../../interface/data/dashboard";

const PendingApprovals = ({ items }: { items: PendingApprovalIF[] }) => {
  const navigate = useNavigate();

  return (
    <Card
      title="Products awaiting approval"
      action={
        <button onClick={() => navigate("/admin/products")} className="text-xs font-medium cursor-pointer" style={{ color: "var(--color-primary)" }}>
          View all
        </button>
      }
    >
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>Nothing pending review.</p>
      ) : (
        <div className="flex flex-col divide-y" style={{ borderColor: "var(--border-light)" }}>
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  by {item.sellerName} · {format(new Date(item.createdAt), "MMM d")}
                </p>
              </div>
              <span className="rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap bg-amber-100 text-amber-700">Pending</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PendingApprovals;