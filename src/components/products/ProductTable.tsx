import { Pencil, Trash2, Check, X, Star, RotateCcw, Trash } from "lucide-react";
import type { ProductIF } from "../../interface/data/product";
import Badge from "../common/Badge";
import { ProductApprovalStatus } from "../../enums/product.enum";

interface ProductTableProps {
  products: ProductIF[];
  trashView?: boolean;
  onView: (product: ProductIF) => void;
  onEdit: (product: ProductIF) => void;
  onDelete: (product: ProductIF) => void;
  onApprove: (product: ProductIF) => void;
  onReject: (product: ProductIF) => void;
  onToggleFeatured: (product: ProductIF) => void;
  onRestore: (product: ProductIF) => void;
  onPermanentDelete: (product: ProductIF) => void;
}

const APPROVAL_STYLES: Record<string, string> = {
  [ProductApprovalStatus.PENDING]: "bg-amber-100 text-amber-700",
  [ProductApprovalStatus.APPROVED]: "bg-green-100 text-green-700",
  [ProductApprovalStatus.REJECTED]: "bg-red-100 text-red-700",
};

const ProductTable = ({
  products,
  trashView = false,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onToggleFeatured,
  onRestore,
  onPermanentDelete,
}: ProductTableProps) => {

  if (products.length === 0) {
    return (
      <p className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
        {trashView ? "No deleted products." : "No products found."}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Product</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Price</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Stock</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Approval</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <div
                  className="flex items-center gap-3 cursor-pointer w-fit"
                  onClick={() => onView(product)}
                >
                  <img src={product.thumbnailImage?.URL} alt={product.title} className="h-10 w-10 rounded-md object-cover" />
                  <div className="flex items-center gap-1.5">
                    <span className="hover:underline" style={{ color: "var(--text-primary)" }}>{product.title}</span>
                    {product.featured && <Star className="h-3.5 w-3.5 fill-current" style={{ color: "var(--warning)" }} />}
                  </div>
                </div>
              </td>
              <td className="py-3" style={{ color: "var(--text-primary)" }}>₹{product.price}</td>
              <td className="py-3" style={{ color: "var(--text-primary)" }}>{product.stock}</td>
              <td className="py-3"><Badge status={product.status} /></td>
              <td className="py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${APPROVAL_STYLES[product.approvalStatus] ?? "bg-gray-100 text-gray-600"}`}>
                  {product.approvalStatus}
                </span>
                {product.approvalStatus === ProductApprovalStatus.REJECTED && product.rejectedReason && (
                  <p className="text-xs mt-1 max-w-40 truncate" style={{ color: "var(--text-muted)" }} title={product.rejectedReason}>
                    {product.rejectedReason}
                  </p>
                )}
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-1.5">
                  {trashView ? (
                    <>
                      <button onClick={() => onRestore(product)} title="Restore product" className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
                        <RotateCcw className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                      </button>
                      <button onClick={() => onPermanentDelete(product)} title="Delete permanently" className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
                        <Trash className="h-4 w-4" style={{ color: "var(--error)" }} />
                      </button>
                    </>
                  ) : (
                    <>
                      {product.approvalStatus !== ProductApprovalStatus.APPROVED && (
                        <button onClick={() => onApprove(product)} title="Approve" className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
                          <Check className="h-4 w-4" style={{ color: "var(--success)" }} />
                        </button>
                      )}
                      {product.approvalStatus !== ProductApprovalStatus.REJECTED && (
                        <button onClick={() => onReject(product)} title="Reject" className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
                          <X className="h-4 w-4" style={{ color: "var(--warning)" }} />
                        </button>
                      )}
                      <button onClick={() => onToggleFeatured(product)} title={product.featured ? "Unfeature" : "Feature"} className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
                        <Star className="h-4 w-4" style={{ color: product.featured ? "var(--warning)" : "var(--text-muted)" }} fill={product.featured ? "currentColor" : "none"} />
                      </button>
                      <button onClick={() => onEdit(product)} title="Edit" className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
                        <Pencil className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                      </button>
                      <button onClick={() => onDelete(product)} title="Delete" className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
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

export default ProductTable;