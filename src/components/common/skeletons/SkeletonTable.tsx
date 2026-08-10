import Skeleton from "./Skeleton";
import SkeletonCircle from "./SkeletonCircle";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  /** first column renders as avatar/thumbnail + two lines (entity name pattern) */
  hasAvatar?: boolean;
  /** render mobile card fallback too (hidden md:block / md:hidden), matches your responsive tables */
  responsive?: boolean;
}

const SkeletonTable = ({ rows = 6, columns = 5, hasAvatar = true, responsive = true }: SkeletonTableProps) => {
  const desktopRows = Array.from({ length: rows });
  const restColumns = Array.from({ length: hasAvatar ? columns - 1 : columns });

  return (
    <>
      {/* ── Desktop / tablet ── */}
      <div className={responsive ? "hidden md:block overflow-x-auto" : "overflow-x-auto"}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="pb-3">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {desktopRows.map((_, rowIdx) => (
              <tr key={rowIdx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                {hasAvatar && (
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <SkeletonCircle size="h-9 w-9" />
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-2.5 w-20" />
                      </div>
                    </div>
                  </td>
                )}
                {restColumns.map((_, colIdx) => (
                  <td key={colIdx} className="py-3">
                    <Skeleton className="h-3 w-16" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      {responsive && (
        <div className="flex flex-col gap-3 md:hidden">
          {Array.from({ length: Math.min(rows, 4) }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)" }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <SkeletonCircle size="h-10 w-10" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center justify-between mt-3">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-2.5 w-14" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SkeletonTable;