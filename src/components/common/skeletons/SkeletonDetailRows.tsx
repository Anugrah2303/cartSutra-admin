import Skeleton from "./Skeleton";

const SkeletonDetailRows = ({ rows = 4 }: { rows?: number }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex justify-between py-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    ))}
  </div>
);

export default SkeletonDetailRows;