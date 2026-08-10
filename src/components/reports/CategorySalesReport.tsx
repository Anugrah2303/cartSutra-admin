import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "../common/Card";
import type { CategorySalesIF } from "../../interface/data/analytics";

const CategorySalesReport = ({ data }: { data: CategorySalesIF[] }) => {
  const chartData = data.map((c) => ({ name: c.categoryName ?? "Uncategorized", revenue: c.revenue }));

  return (
    <Card title="Category-wise sales">
      {data.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No sales in this range.</p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 8, fontSize: 13 }}
                formatter={(value) => [`₹${Number(value ?? 0).toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#16A34A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default CategorySalesReport;