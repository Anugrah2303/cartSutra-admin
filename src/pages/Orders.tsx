import { useMemo, useState } from "react";
import { ShoppingCart, Clock, CheckCircle2, XCircle, IndianRupee } from "lucide-react";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import OrderFilters from "../components/orders/OrderFilters";
import OrderTable from "../components/orders/OrderTable";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import { useGetOrders, type OrderFiltersParams } from "../hooks/queries/order.queries";
import type { AdminOrderIF } from "../interface/data/order";
import { OrderStatus } from "../enums/order.enum";

const Orders = () => {
  const [filters, setFilters] = useState<OrderFiltersParams>({ page: 1, limit: 10 });
  const [viewingOrder, setViewingOrder] = useState<AdminOrderIF | null>(null);

  const { data, isLoading } = useGetOrders(filters);

  const orders: AdminOrderIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? orders.length;
    const pending = orders.filter((o) => o.status === OrderStatus.PENDING).length;
    const delivered = orders.filter((o) => o.status === OrderStatus.DELIVERED).length;
    const cancelled = orders.filter((o) => o.status === OrderStatus.CANCELLED).length;
    const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    return { total, pending, delivered, cancelled, revenue };
  }, [orders, meta]);

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Orders" subtitle="Track and manage every order placed on your marketplace" />
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={5} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Orders" value={stats.total} Icon={ShoppingCart} color="blue" subtext="All orders" />
          <SummaryStatCard label="Pending" value={stats.pending} Icon={Clock} color="amber" subtext="Awaiting action" />
          <SummaryStatCard label="Delivered" value={stats.delivered} Icon={CheckCircle2} color="green" subtext="Completed orders" />
          <SummaryStatCard label="Cancelled" value={stats.cancelled} Icon={XCircle} color="red" subtext="Cancelled orders" />
          <SummaryStatCard label="Revenue (page)" value={`₹${stats.revenue.toLocaleString()}`} Icon={IndianRupee} color="teal" subtext="Sum of this page" />
        </SummaryStatsGrid>
      )}

      <Card>
        <div className="min-w-0">
          {isLoading ? (
            <>
              <SkeletonFilters />
              <SkeletonTable rows={8} columns={8} hasAvatar />
            </>
          ) : (
            <>
              <OrderFilters filters={filters} onChange={setFilters} />
              <OrderTable orders={orders} onView={setViewingOrder} />
              <Pagination page={meta?.page ?? 1} totalPages={meta?.totalPages ?? 1} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
            </>
          )}
        </div>
      </Card>

      <OrderDetailModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
    </div>
  );
};

export default Orders;