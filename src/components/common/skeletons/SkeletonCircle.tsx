import Skeleton from "./Skeleton";

const SkeletonCircle = ({ size = "h-9 w-9" }: { size?: string }) => (
  <Skeleton className={`${size} rounded-full shrink-0`} />
);

export default SkeletonCircle;