import { useNavigate } from "react-router-dom";
import { Check, X, Ban, Trash2, ExternalLink } from "lucide-react";
import type { VendorIF } from "../../interface/data/vendor";
import { VendorApprovalStatus } from "../../enums/vendor.enum";

interface VendorTableProps {
  vendors: VendorIF[];
  onApprove: (vendor: VendorIF) => void;
  onReject: (vendor: VendorIF) => void;
  onBlock: (vendor: VendorIF) => void;
  onDelete: (vendor: VendorIF) => void;
}

const STATUS_STYLES: Record<string, string> = {
  [VendorApprovalStatus.PENDING]: "bg-amber-100 text-amber-700",
  [VendorApprovalStatus.UNDER_REVIEW]: "bg-blue-100 text-blue-700",
  [VendorApprovalStatus.APPROVED]: "bg-green-100 text-green-700",
  [VendorApprovalStatus.REJECTED]: "bg-red-100 text-red-700",
  [VendorApprovalStatus.SUSPENDED]: "bg-gray-100 text-gray-600",
};

const VendorTable = ({ vendors, onApprove, onReject, onBlock, onDelete }: VendorTableProps) => {
  const navigate = useNavigate();

  if (vendors.length === 0) {
    return <p className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>No vendors found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Shop</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Type</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Revenue</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Orders</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <div
                  className="flex items-center gap-3 cursor-pointer w-fit"
                  onClick={() => navigate(`/admin/vendors/${vendor._id}`)}
                >
                  {vendor.shopLogo?.URL ? (
                    <img src={vendor.shopLogo.URL} alt={vendor.shopName} className="h-9 w-9 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold text-white" style={{ background: "var(--gradient-primary)" }}>
                      {vendor.shopName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="hover:underline" style={{ color: "var(--text-primary)" }}>{vendor.shopName}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{vendor.vendorId}</p>
                  </div>
                </div>
              </td>
              <td className="py-3" style={{ color: "var(--text-secondary)" }}>{vendor.vendorType}</td>
              <td className="py-3" style={{ color: "var(--text-primary)" }}>₹{vendor.totalRevenue.toLocaleString()}</td>
              <td className="py-3" style={{ color: "var(--text-primary)" }}>{vendor.totalOrders}</td>
              <td className="py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[vendor.approvalStatus] ?? "bg-gray-100 text-gray-600"}`}>
                  {vendor.approvalStatus.replace("_", " ")}
                </span>
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-1.5">
                  {vendor.approvalStatus !== VendorApprovalStatus.APPROVED && (
                    <button onClick={() => onApprove(vendor)} title="Approve" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                      <Check className="h-4 w-4" style={{ color: "var(--success)" }} />
                    </button>
                  )}
                  {vendor.approvalStatus !== VendorApprovalStatus.REJECTED && (
                    <button onClick={() => onReject(vendor)} title="Reject" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                      <X className="h-4 w-4" style={{ color: "var(--warning)" }} />
                    </button>
                  )}
                  {vendor.approvalStatus !== VendorApprovalStatus.SUSPENDED && (
                    <button onClick={() => onBlock(vendor)} title="Suspend" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                      <Ban className="h-4 w-4" style={{ color: "var(--error)" }} />
                    </button>
                  )}
                  <button onClick={() => onDelete(vendor)} title="Delete" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                    <Trash2 className="h-4 w-4" style={{ color: "var(--error)" }} />
                  </button>
                  {vendor.website && (
                    <a href={vendor.website} target="_blank" rel="noreferrer" title="Website" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                    </a>
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

export default VendorTable;