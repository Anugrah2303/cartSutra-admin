import type { ReactNode } from "react";

const SummaryStatsGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-6">
    {children}
  </div>
);

export default SummaryStatsGrid;