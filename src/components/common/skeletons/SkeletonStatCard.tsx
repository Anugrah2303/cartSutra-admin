import Skeleton from "./Skeleton";

const SkeletonStatCard = () => (
  <div
    className="rounded-2xl border p-5"
    style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
  >
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
    </div>
    <Skeleton className="h-3 w-28 mt-4" />
  </div>
);

export default SkeletonStatCard;