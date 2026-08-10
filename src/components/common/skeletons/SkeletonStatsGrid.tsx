import SummaryStatsGrid from "../SummaryStatsGrid";
import SkeletonStatCard from "./SkeletonStatCard";

const SkeletonStatsGrid = ({ count = 4 }: { count?: number }) => (
  <SummaryStatsGrid>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonStatCard key={i} />
    ))}
  </SummaryStatsGrid>
);

export default SkeletonStatsGrid;