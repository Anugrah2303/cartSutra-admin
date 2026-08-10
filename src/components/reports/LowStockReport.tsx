import { AlertTriangle } from "lucide-react";
import Card from "../common/Card";
import type { LowStockAnalyticsIF } from "../../interface/data/analytics";

const LowStockReport = ({ products }: { products: LowStockAnalyticsIF[] }) => (
  <Card title="Low stock products" action={<span className="text-xs" style={{ color: "var(--text-muted)" }}>Live snapshot</span>}>
    {products.length === 0 ? (
      <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>All products are well stocked.</p>
    ) : (
      <div className="flex flex-col divide-y" style={{ borderColor: "var(--border-light)" }}>
        {products.map((product) => (
          <div key={product._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: "var(--warning)" }} />
              <span className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{product.title}</span>
            </div>
            <span className="text-xs font-medium whitespace-nowrap shrink-0" style={{ color: "var(--warning)" }}>
              {product.stock} left (alert at {product.lowStockAlert})
            </span>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default LowStockReport;