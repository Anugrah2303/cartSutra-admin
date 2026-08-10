import { useEffect, useRef, useState } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ShipmentStatus } from "../../enums/shipment.enum";
import { CARRIER_OPTIONS } from "./shipmentStatusStyles";
import type { ShipmentFiltersParams } from "../../hooks/queries/shipment.queries";

interface ShipmentFiltersProps {
  filters: ShipmentFiltersParams;
  onChange: (filters: ShipmentFiltersParams) => void;
}

const STATUS_TABS = [
  { label: "All", value: "" },
  ...Object.values(ShipmentStatus).map((s) => ({ label: s.replace(/_/g, " "), value: s })),
];

const ShipmentFilters = ({ filters, onChange }: ShipmentFiltersProps) => {
  const set = (patch: Partial<ShipmentFiltersParams>) => onChange({ ...filters, ...patch, page: 1 });

  const hasSecondaryFilters = filters.carrier || filters.startDate || filters.endDate;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => { el.removeEventListener("scroll", updateScrollState); window.removeEventListener("resize", updateScrollState); };
  }, []);

  const scrollByAmount = (dir: "left" | "right") => scrollRef.current?.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });

  return (
    <div className="mb-5">
      {/* status tabs — scrollable, with arrow affordances instead of a visible scrollbar */}
      <div className="relative mb-4 border-b" style={{ borderColor: "var(--border-light)" }}>
        {canScrollLeft && (
          <button onClick={() => scrollByAmount("left")} className="absolute left-0 top-0 bottom-0 z-10 flex w-7 items-center justify-center cursor-pointer" style={{ background: "linear-gradient(to right, var(--bg-card), transparent)" }}>
            <ChevronLeft className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
          </button>
        )}

        <div ref={scrollRef} className="flex gap-1 overflow-x-auto scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {STATUS_TABS.map((tab) => (
            <button key={tab.value} onClick={() => set({ status: tab.value })} className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium cursor-pointer border-b-2 -mb-px whitespace-nowrap capitalize shrink-0" style={{ color: (filters.status ?? "") === tab.value ? "var(--color-primary)" : "var(--text-muted)", borderColor: (filters.status ?? "") === tab.value ? "var(--color-primary)" : "transparent" }}>
              {tab.label.toLowerCase()}
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button onClick={() => scrollByAmount("right")} className="absolute right-0 top-0 bottom-0 z-10 flex w-7 items-center justify-center cursor-pointer" style={{ background: "linear-gradient(to left, var(--bg-card), transparent)" }}>
            <ChevronRight className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
          </button>
        )}
      </div>

      {/* filter controls — stack on mobile, wrap on tablet, row on desktop */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex w-full sm:w-auto sm:max-w-sm sm:flex-1 items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-light)" }}>
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
          <input type="text" value={filters.search ?? ""} onChange={(e) => set({ search: e.target.value })} placeholder="Search shipment #, order #, tracking #..." className="w-full bg-transparent text-sm outline-none" style={{ color: "var(--text-primary)" }} />
        </div>

        <select value={filters.carrier ?? ""} onChange={(e) => set({ carrier: e.target.value })} className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer min-w-0" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}>
          <option value="">All carriers</option>
          {CARRIER_OPTIONS.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
        </select>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input type="date" value={filters.startDate ?? ""} onChange={(e) => set({ startDate: e.target.value })} className="flex-1 sm:flex-none rounded-lg border px-3 py-2 text-sm outline-none min-w-0" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }} />
          <span className="text-sm shrink-0" style={{ color: "var(--text-muted)" }}>to</span>
          <input type="date" value={filters.endDate ?? ""} onChange={(e) => set({ endDate: e.target.value })} className="flex-1 sm:flex-none rounded-lg border px-3 py-2 text-sm outline-none min-w-0" style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }} />
        </div>

        {hasSecondaryFilters && (
          <button onClick={() => set({ carrier: "", startDate: "", endDate: "" })} className="flex items-center gap-1 text-xs cursor-pointer shrink-0" style={{ color: "var(--error)" }}>
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ShipmentFilters;