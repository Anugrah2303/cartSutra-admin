import Skeleton from "./Skeleton";
import SkeletonCircle from "./SkeletonCircle";
import SkeletonStatCard from "./SkeletonStatCard";
import SkeletonDetailRows from "./SkeletonDetailRows";
import Card from "../Card";

interface EntityDetailSkeletonProps {
  statCount?: number;
  sectionCount?: number;
  rowsPerSection?: number;
}

const EntityDetailSkeleton = ({ statCount = 0, sectionCount = 2, rowsPerSection = 4 }: EntityDetailSkeletonProps) => (
  <div className="flex flex-col gap-6">
    <Skeleton className="h-4 w-32" />

    <div className="flex items-center gap-4">
      <SkeletonCircle size="h-16 w-16" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>

    {statCount > 0 && (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: statCount }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
    )}

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {Array.from({ length: sectionCount }).map((_, i) => (
        <Card key={i}>
          <SkeletonDetailRows rows={rowsPerSection} />
        </Card>
      ))}
    </div>
  </div>
);

export default EntityDetailSkeleton;