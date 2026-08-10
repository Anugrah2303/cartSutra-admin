import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  Icon: LucideIcon;
}

const StatCard = ({ label, value, change, Icon }: StatCardProps) => {
  const isPositive = change >= 0;

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: isPositive ? "var(--success)" : "var(--error)" }}>
        {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        <span>{Math.abs(change)}%</span>
        <span style={{ color: "var(--text-muted)" }} className="font-normal">vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;