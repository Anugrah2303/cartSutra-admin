import Skeleton from "./Skeleton";

const SkeletonFilters = ({ withTabs = true }: { withTabs?: boolean }) => (
  <div className="mb-5">
    {withTabs && (
      <div className="flex gap-2 mb-4 border-b pb-3" style={{ borderColor: "var(--border-light)" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-16 rounded-full" />
        ))}
      </div>
    )}
    <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
  </div>
);

export default SkeletonFilters;