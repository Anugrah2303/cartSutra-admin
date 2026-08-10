import Skeleton from "./Skeleton";

// Mimics a labeled input: small label line + full-width field
const SkeletonFormBlock = ({ withLabel = true }: { withLabel?: boolean }) => (
  <div className="flex flex-col gap-2">
    {withLabel && <Skeleton className="h-3 w-24" />}
    <Skeleton className="h-9 w-full rounded-md" />
  </div>
);

export default SkeletonFormBlock;