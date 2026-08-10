// src/pages/VendorPayouts.tsx
import { useMemo, useState } from "react";
import { Wallet, Clock, CheckCircle2, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import ReasonModal from "../components/common/ReasonModal";
import VendorPayoutFilters from "../components/payouts/VendorPayoutFilters";
import VendorPayoutTable from "../components/payouts/VendorPayoutTable";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import {
  useGetVendorPayouts,
  useGetVendorPayoutSummary,
  useProcessVendorPayout,
  useRejectVendorPayout,
  type VendorPayoutFiltersParams,
} from "../hooks/queries/payout.queries";
import type { PayoutIF } from "../interface/data/payout";

const VendorPayouts = () => {
  const [filters, setFilters] = useState<VendorPayoutFiltersParams>({ page: 1, limit: 10 });
  const [processingPayout, setProcessingPayout] = useState<PayoutIF | null>(null);
  const [rejectingPayout, setRejectingPayout] = useState<PayoutIF | null>(null);

  const { data, isLoading } = useGetVendorPayouts(filters);
  const { data: summaryData, isLoading: summaryLoading } = useGetVendorPayoutSummary();
  const processPayout = useProcessVendorPayout();
  const rejectPayout = useRejectVendorPayout();

  const payouts: PayoutIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;
  const summary = summaryData?.data;

  const handleProcessConfirm = (transactionRef: string) => {
    if (!processingPayout) return;
    processPayout.mutate({ id: processingPayout._id, transactionRef }, {
      onSuccess: () => { toast.success("Payout processed successfully"); setProcessingPayout(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleRejectConfirm = (rejectionReason: string) => {
    if (!rejectingPayout) return;
    rejectPayout.mutate({ id: rejectingPayout._id, rejectionReason }, {
      onSuccess: () => { toast.success("Payout rejected, amount refunded to wallet"); setRejectingPayout(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Vendor Payouts" subtitle="Review and process vendor payout requests" />
      </div>

      {summaryLoading || !summary ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Paid Out" value={`₹${summary.totalPaidOut.toLocaleString()}`} Icon={IndianRupee} color="green" subtext="All-time" />
          <SummaryStatCard label="Pending Amount" value={`₹${summary.totalPending.toLocaleString()}`} Icon={Wallet} color="amber" subtext="Awaiting action" />
          <SummaryStatCard label="Pending Requests" value={summary.pendingCount} Icon={Clock} color="blue" subtext="Need review" />
          <SummaryStatCard label="Completed Requests" value={summary.completedCount} Icon={CheckCircle2} color="teal" subtext="All-time" />
        </SummaryStatsGrid>
      )}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters />
            <SkeletonTable rows={8} columns={7} hasAvatar />
          </>
        ) : (
          <>
            <VendorPayoutFilters filters={filters} onChange={setFilters} />
            <VendorPayoutTable payouts={payouts} onProcess={setProcessingPayout} onReject={setRejectingPayout} />
            <Pagination page={meta?.page ?? 1} totalPages={meta?.totalPages ?? 1} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
          </>
        )}
      </Card>

      <ReasonModal
        open={!!processingPayout}
        title={`Process payout #${processingPayout?.payoutNumber ?? ""}`}
        description={`Confirm the transaction reference for this ₹${processingPayout?.amount.toLocaleString()} payout.`}
        label="Transaction reference"
        placeholder="e.g. UTR / transaction ID"
        confirmLabel="Process payout"
        minLength={3}
        multiline={false}
        variant="primary"
        loading={processPayout.isPending}
        onConfirm={handleProcessConfirm}
        onClose={() => setProcessingPayout(null)}
      />

      <ReasonModal
        open={!!rejectingPayout}
        title={`Reject payout #${rejectingPayout?.payoutNumber ?? ""}`}
        description="Provide a reason — the amount will be refunded to the vendor's wallet."
        label="Rejection reason"
        placeholder="e.g. Incorrect bank details on file..."
        confirmLabel="Reject payout"
        minLength={5}
        loading={rejectPayout.isPending}
        onConfirm={handleRejectConfirm}
        onClose={() => setRejectingPayout(null)}
      />
    </div>
  );
};

export default VendorPayouts;