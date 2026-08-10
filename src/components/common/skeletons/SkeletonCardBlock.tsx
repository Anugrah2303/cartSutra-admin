import Skeleton from "./Skeleton";

// Generic placeholder for a report/chart card body when there's no exact shape to mirror
const SkeletonCardBlock = ({ height = "h-48" }: { height?: string }) => (
  <Skeleton className={`w-full ${height}`} />
);

export default SkeletonCardBlock;