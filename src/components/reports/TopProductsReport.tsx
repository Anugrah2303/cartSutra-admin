import Card from "../common/Card";
import type { TopProductIF } from "../../interface/data/analytics";

const TopProductsReport = ({ products }: { products: TopProductIF[] }) => (
  <Card title="Top selling products">
    {products.length === 0 ? (
      <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No sales in this range.</p>
    ) : (
      <div className="flex flex-col divide-y" style={{ borderColor: "var(--border-light)" }}>
        {products.map((product, idx) => (
          <div key={product._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="w-5 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>#{idx + 1}</span>
            <img src={product.thumbnail} alt={product.title} className="h-10 w-10 rounded-md object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{product.title}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{product.unitsSold} units sold</p>
            </div>
            <span className="text-sm font-medium shrink-0" style={{ color: "var(--text-primary)" }}>₹{product.revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default TopProductsReport;