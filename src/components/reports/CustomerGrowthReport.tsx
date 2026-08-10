import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import Card from "../common/Card";
import type { CustomerGrowthPointIF } from "../../interface/data/analytics";

const CustomerGrowthReport = ({ data }: { data: CustomerGrowthPointIF[] }) => {
  const chartData = data.map((d) => ({ label: format(new Date(d._id), "MMM d"), newCustomers: d.newCustomers }));

  return (
    <Card title="New customer signups">
      {data.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No new signups in this range.</p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="customerFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F766E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 8, fontSize: 13 }} />
              <Area type="monotone" dataKey="newCustomers" stroke="#0F766E" strokeWidth={2} fill="url(#customerFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default CustomerGrowthReport;