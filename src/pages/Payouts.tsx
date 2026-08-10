import { useMemo, useState } from "react";
import { IndianRupee, CreditCard, RotateCcw, AlertTriangle } from "lucide-react";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import PaymentFilters from "../components/payments/PaymentFilters";
import PaymentTable from "../components/payments/PaymentTable";
import RefundPaymentModal from "../components/payments/RefundPaymentModal";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import { useGetOrders, type OrderFiltersParams } from "../hooks/queries/order.queries";
import type { AdminOrderIF } from "../interface/data/order";
import { PaymentStatus } from "../enums/order.enum";

const Payments = () => {
  const [filters, setFilters] = useState<OrderFiltersParams>({ page: 1, limit: 10 });
  const [refundingOrder, setRefundingOrder] = useState<AdminOrderIF | null>(null);

  const { data, isLoading } = useGetOrders(filters);

  const orders: AdminOrderIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? orders.length;
    const paidRevenue = orders
      .filter((o) => o.paymentStatus === PaymentStatus.PAID)
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const refundPending = orders.filter((o) => o.paymentStatus === PaymentStatus.REFUND_PENDING).length;
    const failed = orders.filter((o) => o.paymentStatus === PaymentStatus.FAILED).length;
    return { total, paidRevenue, refundPending, failed };
  }, [orders, meta]);

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Payments" subtitle="Track payment status and process refunds across all orders" />
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Transactions" value={stats.total} Icon={CreditCard} color="blue" subtext="All orders" />
          <SummaryStatCard label="Paid Revenue (page)" value={`₹${stats.paidRevenue.toLocaleString()}`} Icon={IndianRupee} color="green" subtext="Sum of paid orders" />
          <SummaryStatCard label="Refund Pending" value={stats.refundPending} Icon={RotateCcw} color="amber" subtext="Awaiting refund" />
          <SummaryStatCard label="Failed" value={stats.failed} Icon={AlertTriangle} color="red" subtext="Failed payments" />
        </SummaryStatsGrid>
      )}

      <Card>
        <div className="min-w-0">
          {isLoading ? (
            <>
              <SkeletonFilters />
              <SkeletonTable rows={8} columns={6} hasAvatar={false} />
            </>
          ) : (
            <>
              <PaymentFilters filters={filters} onChange={setFilters} />
              <PaymentTable orders={orders} onRefund={setRefundingOrder} />
              <Pagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
              />
            </>
          )}
        </div>
      </Card>

      <RefundPaymentModal order={refundingOrder} onClose={() => setRefundingOrder(null)} />
    </div>
  );
};

export default Payments;