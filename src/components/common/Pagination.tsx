import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Returns a compact list of page numbers with "..." gaps, e.g.
// [1, "...", 4, 5, 6, "...", 20] — always keeps first, last, and a
// window around the current page.
const getPageRange = (current: number, total: number): (number | "ellipsis")[] => {
  const delta = 1;
  const range: (number | "ellipsis")[] = [];

  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  range.push(1);

  if (start > 2) range.push("ellipsis");

  for (let i = start; i <= end; i++) range.push(i);

  if (end < total - 1) range.push("ellipsis");

  if (total > 1) range.push(total);

  return range;
};

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getPageRange(page, totalPages);

  const baseBtn = "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors cursor-pointer";

  return (
    <div className="flex items-center justify-between gap-3 mt-5 flex-wrap">
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className={`${baseBtn} border disabled:opacity-40 disabled:cursor-not-allowed`}
          style={{ borderColor: "var(--border-light)", color: "var(--text-secondary)" }}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center"
              style={{ color: "var(--text-muted)" }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={baseBtn}
              style={
                p === page
                  ? { backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 500 }
                  : { color: "var(--text-secondary)" }
              }
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`${baseBtn} border disabled:opacity-40 disabled:cursor-not-allowed`}
          style={{ borderColor: "var(--border-light)", color: "var(--text-secondary)" }}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;