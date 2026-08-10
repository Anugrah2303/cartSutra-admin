// src/components/refunds/RefundFilters.tsx
import { Search, X } from "lucide-react";
import { REFUND_STATUS_OPTIONS, REFUND_SOURCE_OPTIONS, REFUND_SOURCE_LABELS } from "./refundStyles";
import type { RefundFiltersParams } from "../../hooks/queries/refund.queries";

const STATUS_TABS = [{ label: "All", value: "" }, ...REFUND_STATUS_OPTIONS.map((s) => ({ label: s, value: s }))];

const RefundFilters = ({ filters, onChange }: { filters: RefundFiltersParams; onChange: (f: RefundFiltersParams) => void }) => {
  const set = (patch: Partial<RefundFiltersParams>) => onChange({ ...filters, ...patch, page: 1 });
  const hasSecondary = !!filters.source;

  return (
    <div className="mb-5">
      <div className="flex gap-1 mb-4 border-b overflow-x-auto" style={{ borderColor: "var(--border-light)" }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => set({ status: tab.value })}
            className="px-4 py-2.5 text-sm font-medium cursor-pointer border-b-2 -mb-px whitespace-nowrap"
            style={{
              color: (filters.status ?? "") === tab.value ? "var(--color-primary)" : "var(--text-muted)",
              borderColor: (filters.status ?? "") === tab.value ? "var(--color-primary)" : "transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex w-full sm:max-w-sm sm:flex-1 items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-light)" }}>
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search refund #, order #..."
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <select value={filters.source ?? ""} onChange={(e) => set({ source: e.target.value })} className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}>
          <option value="">All sources</option>
          {REFUND_SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{REFUND_SOURCE_LABELS[s]}</option>)}
        </select>

        {hasSecondary && (
          <button onClick={() => set({ source: "" })} className="flex items-center gap-1 text-xs cursor-pointer" style={{ color: "var(--error)" }}>
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default RefundFilters;