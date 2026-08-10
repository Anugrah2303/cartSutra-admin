import Skeleton from "./Skeleton";
import SkeletonCircle from "./SkeletonCircle";

interface SkeletonListRowsProps {
  rows?: number;
  hasAvatar?: boolean;
}

const SkeletonListRows = ({ rows = 5, hasAvatar = false }: SkeletonListRowsProps) => (
  <div className="flex flex-col divide-y" style={{ borderColor: "var(--border-light)" }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
        <div className="flex items-center gap-2.5">
          {hasAvatar && <SkeletonCircle size="h-8 w-8" />}
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    ))}
  </div>
);

export default SkeletonListRows;