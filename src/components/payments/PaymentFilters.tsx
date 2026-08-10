import { Search, X } from "lucide-react";
import { PaymentStatus } from "../../enums/order.enum";
import { PAYMENT_METHOD_OPTIONS } from "../orders/orderStatusStyles";
import type { OrderFiltersParams } from "../../hooks/queries/order.queries";

interface PaymentFiltersProps {
  filters: OrderFiltersParams;
  onChange: (filters: OrderFiltersParams) => void;
}

const STATUS_TABS = [
  { label: "All", value: "" },
  ...Object.values(PaymentStatus).map((s) => ({ label: s.replace(/_/g, " "), value: s })),
];

const PaymentFilters = ({ filters, onChange }: PaymentFiltersProps) => {
  const set = (patch: Partial<OrderFiltersParams>) => onChange({ ...filters, ...patch, page: 1 });
  const hasSecondaryFilters = filters.paymentMethod || filters.startDate || filters.endDate;

  return (
    <div className="mb-5">
      <div className="flex gap-1 mb-4 border-b overflow-x-auto" style={{ borderColor: "var(--border-light)" }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => set({ paymentStatus: tab.value })}
            className="px-4 py-2.5 text-sm font-medium cursor-pointer border-b-2 -mb-px whitespace-nowrap capitalize"
            style={{
              color: (filters.paymentStatus ?? "") === tab.value ? "var(--color-primary)" : "var(--text-muted)",
              borderColor: (filters.paymentStatus ?? "") === tab.value ? "var(--color-primary)" : "transparent",
            }}
          >
            {tab.label.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex w-full sm:w-auto sm:max-w-sm sm:flex-1 items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-light)" }}>
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search order #, payment ID..."
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <select
          value={filters.paymentMethod ?? ""}
          onChange={(e) => set({ paymentMethod: e.target.value })}
          className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer min-w-0"
          style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}
        >
          <option value="">All payment methods</option>
          {PAYMENT_METHOD_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input type="date" value={filters.startDate ?? ""} onChange={(e) => set({ startDate: e.target.value })} className="flex-1 sm:flex-none rounded-lg border px-3 py-2 text-sm outline-none min-w-0" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }} />
          <span className="text-sm shrink-0" style={{ color: "var(--text-muted)" }}>to</span>
          <input type="date" value={filters.endDate ?? ""} onChange={(e) => set({ endDate: e.target.value })} className="flex-1 sm:flex-none rounded-lg border px-3 py-2 text-sm outline-none min-w-0" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }} />
        </div>

        {hasSecondaryFilters && (
          <button onClick={() => set({ paymentMethod: "", startDate: "", endDate: "" })} className="flex items-center gap-1 text-xs cursor-pointer shrink-0" style={{ color: "var(--error)" }}>
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentFilters;