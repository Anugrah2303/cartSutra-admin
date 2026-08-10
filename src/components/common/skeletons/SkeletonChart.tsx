import Skeleton from "./Skeleton";

const SkeletonChart = ({ height = "h-72" }: { height?: string }) => (
  <div className={`${height} w-full flex items-end gap-2 px-2`}>
    {Array.from({ length: 12 }).map((_, i) => (
      <Skeleton
        key={i}
        className="flex-1 rounded-t-md rounded-b-none"
        style={{ height: `${30 + ((i * 37) % 60)}%` }}
      />
    ))}
  </div>
);

export default SkeletonChart;