import { Search } from "lucide-react";
import { ProductLifecycleStatus } from "../../enums/product.enum";

interface ProductFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const ProductFilters = ({ search, status, onSearchChange, onStatusChange }: ProductFiltersProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
    <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-light)" }}>
      <Search className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
        className="w-full bg-transparent text-sm outline-none"
        style={{ color: "var(--text-primary)" }}
      />
    </div>

    <select
      value={status}
      onChange={(e) => onStatusChange(e.target.value)}
      className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer"
      style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}
    >
      <option value="">All statuses</option>
      {Object.values(ProductLifecycleStatus).map((s) => (
        <option key={s} value={s}>{s.replace("_", " ")}</option>
      ))}
    </select>
  </div>
);

export default ProductFilters;