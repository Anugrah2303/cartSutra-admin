import { Search, X } from "lucide-react";
import { TicketStatus, TicketCategory } from "../../enums/ticket.enum";
import { TICKET_PRIORITY_OPTIONS } from "./ticketStyles";
import type { TicketFiltersParams } from "../../hooks/queries/ticket.queries";

interface TicketFiltersProps {
  filters: TicketFiltersParams;
  onChange: (filters: TicketFiltersParams) => void;
}

const STATUS_TABS = [
  { label: "All", value: "" },
  ...Object.values(TicketStatus).map((s) => ({ label: s.replace(/_/g, " "), value: s })),
];

const TicketFilters = ({ filters, onChange }: TicketFiltersProps) => {
  const set = (patch: Partial<TicketFiltersParams>) => onChange({ ...filters, ...patch, page: 1 });
  const hasSecondaryFilters = filters.priority || filters.category;

  return (
    <div className="mb-5">
      <div className="flex gap-1 mb-4 border-b overflow-x-auto" style={{ borderColor: "var(--border-light)" }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => set({ status: tab.value })}
            className="px-4 py-2.5 text-sm font-medium cursor-pointer border-b-2 -mb-px whitespace-nowrap capitalize"
            style={{
              color: (filters.status ?? "") === tab.value ? "var(--color-primary)" : "var(--text-muted)",
              borderColor: (filters.status ?? "") === tab.value ? "var(--color-primary)" : "transparent",
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
            placeholder="Search ticket #, subject..."
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <select value={filters.priority ?? ""} onChange={(e) => set({ priority: e.target.value })} className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}>
          <option value="">All priorities</option>
          {TICKET_PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select value={filters.category ?? ""} onChange={(e) => set({ category: e.target.value })} className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}>
          <option value="">All categories</option>
          {Object.values(TicketCategory).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {hasSecondaryFilters && (
          <button onClick={() => set({ priority: "", category: "" })} className="flex items-center gap-1 text-xs cursor-pointer" style={{ color: "var(--error)" }}>
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketFilters;