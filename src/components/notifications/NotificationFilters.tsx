import { Search, X } from "lucide-react";
import { NotificationType, NotificationAudience } from "../../enums/notification.enum";
import type { NotificationFiltersParams } from "../../hooks/queries/notification.queries";

interface NotificationFiltersProps {
  filters: NotificationFiltersParams;
  onChange: (filters: NotificationFiltersParams) => void;
}

const NotificationFilters = ({ filters, onChange }: NotificationFiltersProps) => {
  const set = (patch: Partial<NotificationFiltersParams>) => onChange({ ...filters, ...patch, page: 1 });
  const hasFilters = filters.audience || filters.type;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-5">
      <div className="flex w-full sm:max-w-sm items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-light)" }}>
        <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={filters.search ?? ""}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search notifications..."
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      <select value={filters.audience ?? ""} onChange={(e) => set({ audience: e.target.value })} className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}>
        <option value="">All audiences</option>
        {Object.values(NotificationAudience).map((a) => <option key={a} value={a}>{a}</option>)}
      </select>

      <select value={filters.type ?? ""} onChange={(e) => set({ type: e.target.value })} className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}>
        <option value="">All types</option>
        {Object.values(NotificationType).map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      {hasFilters && (
        <button onClick={() => set({ audience: "", type: "" })} className="flex items-center gap-1 text-xs cursor-pointer" style={{ color: "var(--error)" }}>
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  );
};

export default NotificationFilters;