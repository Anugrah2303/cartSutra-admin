import { useEffect, useRef, useState } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ReturnReason } from "../../enums/return.enum";
import { RETURN_STATUS_OPTIONS } from "./returnStatusStyles";
import type { ReturnFiltersParams } from "../../hooks/queries/return.queries";

const STATUS_TABS = [
  { label: "All", value: "" },
  ...RETURN_STATUS_OPTIONS.map((s) => ({
    label: s.replace(/_/g, " "),
    value: s,
  })),
];

const ReturnFilters = ({
  filters,
  onChange,
}: {
  filters: ReturnFiltersParams;
  onChange: (f: ReturnFiltersParams) => void;
}) => {
  const set = (patch: Partial<ReturnFiltersParams>) =>
    onChange({ ...filters, ...patch, page: 1 });

  const hasSecondary = !!filters.reason;

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

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollByAmount = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -160 : 160,
      behavior: "smooth",
    });

  return (
    <div className="mb-5">
      <div
        className="relative mb-4 border-b"
        style={{ borderColor: "var(--border-light)" }}
      >
        {canScrollLeft && (
          <button
            onClick={() => scrollByAmount("left")}
            className="absolute left-0 top-0 bottom-0 z-10 flex w-7 items-center justify-center cursor-pointer"
            style={{
              background:
                "linear-gradient(to right, var(--bg-card), transparent)",
            }}
          >
            <ChevronLeft
              className="h-6 w-6"
              style={{ color: "var(--color-primary)" }}
            />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`div::-webkit-scrollbar{display:none;}`}</style>

          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => set({ status: tab.value })}
              className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium cursor-pointer border-b-2 -mb-px whitespace-nowrap capitalize shrink-0"
              style={{
                color:
                  (filters.status ?? "") === tab.value
                    ? "var(--color-primary)"
                    : "var(--text-muted)",
                borderColor:
                  (filters.status ?? "") === tab.value
                    ? "var(--color-primary)"
                    : "transparent",
              }}
            >
              {tab.label.toLowerCase()}
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scrollByAmount("right")}
            className="absolute right-0 top-0 bottom-0 z-10 flex w-7 items-center justify-center cursor-pointer"
            style={{
              background:
                "linear-gradient(to left, var(--bg-card), transparent)",
            }}
          >
            <ChevronRight
              className="h-6 w-6"
              style={{ color: "var(--color-primary)" }}
            />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div
          className="flex w-full sm:max-w-sm sm:flex-1 items-center gap-2 rounded-lg border px-3 py-2"
          style={{ borderColor: "var(--border-light)" }}
        >
          <Search
            className="h-4 w-4 shrink-0"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search return #, order #, product..."
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <select
          value={filters.reason ?? ""}
          onChange={(e) => set({ reason: e.target.value })}
          className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer"
          style={{
            borderColor: "var(--border-light)",
            color: "var(--text-primary)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <option value="">All reasons</option>
          {Object.values(ReturnReason).map((r) => (
            <option key={r} value={r}>
              {r.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        {hasSecondary && (
          <button
            onClick={() => set({ reason: "" })}
            className="flex items-center gap-1 text-xs cursor-pointer"
            style={{ color: "var(--error)" }}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default ReturnFilters;