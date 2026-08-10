import Skeleton from "./Skeleton";

interface SkeletonTextProps {
  width?: string; // tailwind width class, e.g. "w-32"
  height?: string; // tailwind height class, e.g. "h-3"
  className?: string;
}

const SkeletonText = ({ width = "w-24", height = "h-3", className = "" }: SkeletonTextProps) => (
  <Skeleton className={`${width} ${height} ${className}`} />
);

export default SkeletonText;