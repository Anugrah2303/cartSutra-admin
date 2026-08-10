import { Search, X } from "lucide-react";
import type { ReviewFiltersParams } from "../../hooks/queries/review.queries";

interface ReviewFiltersProps {
  filters: ReviewFiltersParams;
  onChange: (filters: ReviewFiltersParams) => void;
}

const ReviewFilters = ({ filters, onChange }: ReviewFiltersProps) => {
  const set = (patch: Partial<ReviewFiltersParams>) => onChange({ ...filters, ...patch, page: 1 });
  const hasFilters = filters.rating || filters.isApproved;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-5">
      <div className="flex w-full sm:max-w-sm items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-light)" }}>
        <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={filters.search ?? ""}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search review title or comment..."
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      <select value={filters.rating ?? ""} onChange={(e) => set({ rating: e.target.value })} className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}>
        <option value="">All ratings</option>
        {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} star{r > 1 ? "s" : ""}</option>)}
      </select>

      <select value={filters.isApproved ?? ""} onChange={(e) => set({ isApproved: e.target.value })} className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}>
        <option value="">All statuses</option>
        <option value="true">Approved</option>
        <option value="false">Hidden</option>
      </select>

      {hasFilters && (
        <button onClick={() => set({ rating: "", isApproved: "" })} className="flex items-center gap-1 text-xs cursor-pointer" style={{ color: "var(--error)" }}>
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  );
};

export default ReviewFilters;