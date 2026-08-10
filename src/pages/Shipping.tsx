import { useMemo, useState } from "react";
import { Truck, Package, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import ShipmentFilters from "../components/shipping/ShipmentFilters";
import ShipmentTable from "../components/shipping/ShipmentTable";
import ShipmentDetailModal from "../components/shipping/ShipmentDetailModal";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import { useGetShipments, type ShipmentFiltersParams } from "../hooks/queries/shipment.queries";
import type { ShipmentIF } from "../interface/data/shipment";
import { ShipmentStatus } from "../enums/shipment.enum";

const Shipping = () => {
  const [filters, setFilters] = useState<ShipmentFiltersParams>({ page: 1, limit: 10 });
  const [viewingShipment, setViewingShipment] = useState<ShipmentIF | null>(null);

  const { data, isLoading } = useGetShipments(filters);

  const shipments: ShipmentIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? shipments.length;
    const inTransit = shipments.filter((s) =>
      [ShipmentStatus.SHIPPED, ShipmentStatus.IN_TRANSIT, ShipmentStatus.OUT_FOR_DELIVERY].includes(s.status)
    ).length;
    const delivered = shipments.filter((s) => s.status === ShipmentStatus.DELIVERED).length;
    const failed = shipments.filter((s) => s.status === ShipmentStatus.FAILED_DELIVERY).length;
    const cancelled = shipments.filter((s) => s.status === ShipmentStatus.CANCELLED).length;
    return { total, inTransit, delivered, failed, cancelled };
  }, [shipments, meta]);

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Shipping" subtitle="Track and manage shipments across all vendors" />
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={5} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Shipments" value={stats.total} Icon={Package} color="blue" subtext="All shipments" />
          <SummaryStatCard label="In Transit" value={stats.inTransit} Icon={Truck} color="indigo" subtext="On the way" />
          <SummaryStatCard label="Delivered" value={stats.delivered} Icon={CheckCircle2} color="green" subtext="Completed" />
          <SummaryStatCard label="Failed Delivery" value={stats.failed} Icon={AlertTriangle} color="amber" subtext="Needs attention" />
          <SummaryStatCard label="Cancelled" value={stats.cancelled} Icon={XCircle} color="red" subtext="Cancelled shipments" />
        </SummaryStatsGrid>
      )}

      <Card>
        <div className="min-w-0">
          {isLoading ? (
            <>
              <SkeletonFilters />
              <SkeletonTable rows={8} columns={7} hasAvatar={false} />
            </>
          ) : (
            <>
              <ShipmentFilters filters={filters} onChange={setFilters} />
              <ShipmentTable shipments={shipments} onView={setViewingShipment} />
              <Pagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
              />
            </>
          )}
        </div>
      </Card>

      <ShipmentDetailModal shipment={viewingShipment} onClose={() => setViewingShipment(null)} />
    </div>
  );
};

export default Shipping;