import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import { VendorApprovalStatus } from "../../enums/vendor.enum";
import type { RecentVendorIF } from "../../interface/data/dashboard";

const STATUS_STYLES: Record<string, string> = {
  [VendorApprovalStatus.PENDING]: "bg-amber-100 text-amber-700",
  [VendorApprovalStatus.UNDER_REVIEW]: "bg-blue-100 text-blue-700",
  [VendorApprovalStatus.APPROVED]: "bg-green-100 text-green-700",
  [VendorApprovalStatus.REJECTED]: "bg-red-100 text-red-700",
  [VendorApprovalStatus.SUSPENDED]: "bg-gray-100 text-gray-600",
};

const RecentVendors = ({ vendors }: { vendors: RecentVendorIF[] }) => {
  const navigate = useNavigate();

  return (
    <Card
      title="New vendor signups"
      action={
        <button onClick={() => navigate("/admin/vendors")} className="text-xs font-medium cursor-pointer" style={{ color: "var(--color-primary)" }}>
          View all
        </button>
      }
    >
      {vendors.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No recent signups.</p>
      ) : (
        <div className="flex flex-col divide-y" style={{ borderColor: "var(--border-light)" }}>
          {vendors.map((vendor) => (
            <div key={vendor._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{vendor.shopName}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{format(new Date(vendor.createdAt), "MMM d, yyyy")}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[vendor.approvalStatus] ?? "bg-gray-100 text-gray-600"}`}>
                {vendor.approvalStatus.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentVendors;