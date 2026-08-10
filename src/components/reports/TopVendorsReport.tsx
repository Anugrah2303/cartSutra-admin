import Card from "../common/Card";
import type { TopVendorIF } from "../../interface/data/analytics";

const TopVendorsReport = ({ vendors }: { vendors: TopVendorIF[] }) => (
  <Card title="Top performing vendors">
    {vendors.length === 0 ? (
      <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No sales in this range.</p>
    ) : (
      <div className="flex flex-col divide-y" style={{ borderColor: "var(--border-light)" }}>
        {vendors.map((v, idx) => (
          <div key={v._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="w-5 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>#{idx + 1}</span>
            {v.vendor?.shopLogo?.URL ? (
              <img src={v.vendor.shopLogo.URL} alt={v.vendor.shopName} className="h-10 w-10 rounded-md object-cover shrink-0" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-md text-sm font-semibold text-white shrink-0" style={{ background: "var(--gradient-primary)" }}>
                {v.vendor?.shopName?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{v.vendor?.shopName ?? "Unknown vendor"}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{v.unitsSold} units sold</p>
            </div>
            <span className="text-sm font-medium shrink-0" style={{ color: "var(--text-primary)" }}>₹{v.revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default TopVendorsReport;