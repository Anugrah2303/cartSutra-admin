import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "../common/Card";
import type { OrderStatusDistributionIF } from "../../interface/data/analytics";
import { ORDER_STATUS_STYLES } from "../orders/orderStatusStyles";

// pull a hex-ish color per status by reusing the same semantic mapping used elsewhere;
// falls back to a neutral palette when a status has no explicit chart color
const COLORS = ["#16A34A", "#0F766E", "#2563EB", "#7C3AED", "#F59E0B", "#EF4444", "#EA580C", "#64748B", "#0EA5E9", "#DB2777"];

const OrderStatusReport = ({ data }: { data: OrderStatusDistributionIF[] }) => {
  const chartData = data.map((d) => ({ name: d._id.replace(/_/g, " "), value: d.count }));

  return (
    <Card title="Order status distribution">
      {data.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No orders in this range.</p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {chartData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 8, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default OrderStatusReport;
export { ORDER_STATUS_STYLES }; // re-exported only to keep import consistent with badges elsewhere, unused here