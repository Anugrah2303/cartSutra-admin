// src/pages/Refunds.tsx
import { useMemo, useState } from "react";
import { Receipt, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ReasonModal from "../components/common/ReasonModal";
import RefundFilters from "../components/refunds/RefundFilters";
import RefundTable from "../components/refunds/RefundTable";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import { useGetRefunds, useProcessRefund, useRetryRefund, useCancelRefund, type RefundFiltersParams } from "../hooks/queries/refund.queries";
import type { RefundIF } from "../interface/data/refund";
import { RefundStatus } from "../enums/refund.enum";

const Refunds = () => {
  const [filters, setFilters] = useState<RefundFiltersParams>({ page: 1, limit: 10 });
  const [processingRefund, setProcessingRefund] = useState<RefundIF | null>(null);
  const [cancellingRefund, setCancellingRefund] = useState<RefundIF | null>(null);

  const { data, isLoading } = useGetRefunds(filters);
  const processRefund = useProcessRefund();
  const retryRefund = useRetryRefund();
  const cancelRefund = useCancelRefund();

  const refunds: RefundIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? refunds.length;
    const pending = refunds.filter((r) => r.status === RefundStatus.PENDING).length;
    const completed = refunds.filter((r) => r.status === RefundStatus.COMPLETED).length;
    const failed = refunds.filter((r) => r.status === RefundStatus.FAILED).length;
    return { total, pending, completed, failed };
  }, [refunds, meta]);

  const handleProcessConfirm = () => {
    if (!processingRefund) return;
    processRefund.mutate(processingRefund._id, {
      onSuccess: () => { toast.success("Refund processed successfully"); setProcessingRefund(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleRetry = (refund: RefundIF) => {
    retryRefund.mutate(refund._id, {
      onSuccess: () => toast.success("Refund retried successfully"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleCancelConfirm = (reason: string) => {
    if (!cancellingRefund) return;
    cancelRefund.mutate({ id: cancellingRefund._id, reason: reason || undefined }, {
      onSuccess: () => { toast.success("Refund cancelled"); setCancellingRefund(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Refunds" subtitle="Track and process refunds across orders and returns" />
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Refunds" value={stats.total} Icon={Receipt} color="blue" subtext="All refunds" />
          <SummaryStatCard label="Pending" value={stats.pending} Icon={Clock} color="amber" subtext="Awaiting processing" />
          <SummaryStatCard label="Completed" value={stats.completed} Icon={CheckCircle2} color="green" subtext="This page" />
          <SummaryStatCard label="Failed" value={stats.failed} Icon={XCircle} color="red" subtext="Needs retry" />
        </SummaryStatsGrid>
      )}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters />
            <SkeletonTable rows={8} columns={8} hasAvatar={false} />
          </>
        ) : (
          <>
            <RefundFilters filters={filters} onChange={setFilters} />
            <RefundTable refunds={refunds} onProcess={setProcessingRefund} onRetry={handleRetry} onCancel={setCancellingRefund} />
            <Pagination page={meta?.page ?? 1} totalPages={meta?.totalPages ?? 1} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!processingRefund}
        title="Process refund"
        description={`Process refund #${processingRefund?.refundNumber} for ₹${processingRefund?.amount.toLocaleString()}? This will attempt to send the amount via ${processingRefund?.method.replace(/_/g, " ").toLowerCase()}.`}
        confirmLabel="Process refund"
        loadingLabel="Processing..."
        variant="primary"
        loading={processRefund.isPending}
        onConfirm={handleProcessConfirm}
        onClose={() => setProcessingRefund(null)}
      />

      <ReasonModal
        open={!!cancellingRefund}
        title={`Cancel refund #${cancellingRefund?.refundNumber ?? ""}`}
        description="Provide an optional reason for cancelling this refund."
        label="Reason (optional)"
        placeholder="e.g. Duplicate refund request..."
        confirmLabel="Cancel refund"
        minLength={0}
        loading={cancelRefund.isPending}
        onConfirm={handleCancelConfirm}
        onClose={() => setCancellingRefund(null)}
      />
    </div>
  );
};

export default Refunds;