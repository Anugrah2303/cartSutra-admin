import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import type { LowStockProductIF } from "../../interface/data/dashboard";

const LowStockAlert = ({ products }: { products: LowStockProductIF[] }) => {
  const navigate = useNavigate();

  return (
    <Card
      title="Low stock alerts"
      action={
        <button onClick={() => navigate("/admin/products")} className="text-xs font-medium cursor-pointer" style={{ color: "var(--color-primary)" }}>
          View all
        </button>
      }
    >
      {products.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>All products are well stocked.</p>
      ) : (
        <div className="flex flex-col divide-y" style={{ borderColor: "var(--border-light)" }}>
          {products.map((product) => (
            <div key={product._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: "var(--warning)" }} />
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>{product.title}</span>
              </div>
              <span className="text-xs font-medium whitespace-nowrap" style={{ color: "var(--warning)" }}>
                {product.stock} left (alert at {product.lowStockAlert})
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default LowStockAlert;