import { Search } from "lucide-react";

interface CategoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const CategoryFilters = ({ search, onSearchChange }: CategoryFiltersProps) => (
  <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border px-3 py-2 mb-5" style={{ borderColor: "var(--border-light)" }}>
    <Search className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
    <input
      type="text"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search categories..."
      className="w-full bg-transparent text-sm outline-none"
      style={{ color: "var(--text-primary)" }}
    />
  </div>
);

export default CategoryFilters;