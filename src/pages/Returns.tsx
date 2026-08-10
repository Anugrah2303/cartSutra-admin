import { useMemo, useState } from "react";
import { RotateCcw, Clock, IndianRupee, CheckCircle2 } from "lucide-react";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import ReturnFilters from "../components/returns/ReturnFilters";
import ReturnTable from "../components/returns/ReturnTable";
import ReturnDetailModal from "../components/returns/ReturnDetailModal";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import { useGetReturns, type ReturnFiltersParams } from "../hooks/queries/return.queries";
import type { ReturnIF } from "../interface/data/return";
import { ReturnStatus } from "../enums/return.enum";

const Returns = () => {
  const [filters, setFilters] = useState<ReturnFiltersParams>({ page: 1, limit: 10 });
  const [viewingReturnId, setViewingReturnId] = useState<string | null>(null);

  const { data, isLoading } = useGetReturns(filters);

  const returns: ReturnIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? returns.length;
    const requested = returns.filter((r) => r.status === ReturnStatus.REQUESTED).length;
    const refundPending = returns.filter((r) => r.status === ReturnStatus.REFUND_PENDING).length;
    const refundedAmount = returns
      .filter((r) => r.status === ReturnStatus.REFUNDED)
      .reduce((sum, r) => sum + r.refundAmount, 0);
    return { total, requested, refundPending, refundedAmount };
  }, [returns, meta]);

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Returns" subtitle="Review return requests and process refunds across the marketplace" />
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Returns" value={stats.total} Icon={RotateCcw} color="blue" subtext="All returns" />
          <SummaryStatCard label="Awaiting Review" value={stats.requested} Icon={Clock} color="amber" subtext="Needs approval or rejection" />
          <SummaryStatCard label="Refund Pending" value={stats.refundPending} Icon={IndianRupee} color="teal" subtext="Item received, refund owed" />
          <SummaryStatCard label="Refunded (page)" value={`₹${stats.refundedAmount.toLocaleString()}`} Icon={CheckCircle2} color="green" subtext="Completed this page" />
        </SummaryStatsGrid>
      )}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters />
            <SkeletonTable rows={8} columns={7} hasAvatar={false} />
          </>
        ) : (
          <>
            <ReturnFilters filters={filters} onChange={setFilters} />
            <ReturnTable returns={returns} onView={(r) => setViewingReturnId(r._id)} />
            <Pagination page={meta?.page ?? 1} totalPages={meta?.totalPages ?? 1} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
          </>
        )}
      </Card>

      <ReturnDetailModal returnId={viewingReturnId} onClose={() => setViewingReturnId(null)} />
    </div>
  );
};

export default Returns;