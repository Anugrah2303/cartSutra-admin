import { Pencil, Trash2, RotateCcw, Trash } from "lucide-react";
import { format } from "date-fns";
import type { CouponIF } from "../../interface/data/coupon";
import { DiscountType } from "../../enums/coupon.enum";
import StatusToggle from "../common/StatusToggle";

interface CouponTableProps {
  coupons: CouponIF[];
  trashView?: boolean;
  onEdit: (coupon: CouponIF) => void;
  onDelete: (coupon: CouponIF) => void;
  onToggle: (coupon: CouponIF) => void;
  onRestore: (coupon: CouponIF) => void;
  onPermanentDelete: (coupon: CouponIF) => void;
}

const CouponTable = ({ coupons, trashView = false, onEdit, onDelete, onToggle, onRestore, onPermanentDelete }: CouponTableProps) => {
  if (coupons.length === 0) {
    return (
      <p className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
        {trashView ? "No deleted coupons." : "No coupons found."}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Code</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Discount</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Validity</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Usage</th>
            {!trashView && <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>}
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <span className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>{coupon.code}</span>
                {coupon.description && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{coupon.description}</p>}
              </td>
              <td className="py-3" style={{ color: "var(--text-primary)" }}>
                {coupon.discountType === DiscountType.PERCENTAGE ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
              </td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                {format(new Date(coupon.validFrom), "MMM d")} – {format(new Date(coupon.validUntil), "MMM d, yyyy")}
              </td>
              <td className="py-3" style={{ color: "var(--text-secondary)" }}>
                {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
              </td>
              {!trashView && (
                <td className="py-3">
                  <StatusToggle isActive={coupon.isActive} onToggle={() => onToggle(coupon)} />
                </td>
              )}
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  {trashView ? (
                    <>
                      <button onClick={() => onRestore(coupon)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer" title="Restore coupon">
                        <RotateCcw className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                      </button>
                      <button onClick={() => onPermanentDelete(coupon)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer" title="Delete permanently">
                        <Trash className="h-4 w-4" style={{ color: "var(--error)" }} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => onEdit(coupon)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                        <Pencil className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                      </button>
                      <button onClick={() => onDelete(coupon)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                        <Trash2 className="h-4 w-4" style={{ color: "var(--error)" }} />
                      </button>
                    </>
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

export default CouponTable;