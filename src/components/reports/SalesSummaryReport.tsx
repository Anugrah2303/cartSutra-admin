import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { IndianRupee, ShoppingCart, Wallet } from "lucide-react";
import Card from "../common/Card";
import SummaryStatCard from "../common/SummaryStatCard";
import SummaryStatsGrid from "../common/SummaryStatsGrid";
import type { SalesAnalyticsIF } from "../../interface/data/analytics";

const SalesSummaryReport = ({ data }: { data: SalesAnalyticsIF }) => {
  const chartData = data.dayWise.map((d) => ({
    label: format(new Date(d._id), "MMM d"),
    revenue: d.revenue,
    orders: d.orders,
  }));

  return (
    <div className="flex flex-col gap-6">
      <SummaryStatsGrid>
        <SummaryStatCard label="Total Revenue" value={`₹${data.totals.totalRevenue.toLocaleString()}`} Icon={IndianRupee} color="green" subtext="For selected range" />
        <SummaryStatCard label="Total Orders" value={data.totals.totalOrders} Icon={ShoppingCart} color="blue" subtext="Excludes cancelled" />
        <SummaryStatCard label="Avg. Order Value" value={`₹${Math.round(data.totals.avgOrderValue).toLocaleString()}`} Icon={Wallet} color="purple" subtext="Per order" />
      </SummaryStatsGrid>

      <Card title="Revenue trend">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 8, fontSize: 13 }}
                formatter={(value, name) => [name === "revenue" ? `₹${Number(value).toLocaleString()}` : value, name === "revenue" ? "Revenue" : "Orders"]}
              />
              <Line type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="orders" stroke="#0F766E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default SalesSummaryReport;