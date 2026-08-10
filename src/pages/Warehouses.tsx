import { useMemo, useState } from "react";
import { Warehouse as WarehouseIcon, CheckCircle2, Ban, Star } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import WarehouseFilters from "../components/warehouses/WarehouseFilters";
import WarehouseTable from "../components/warehouses/WarehouseTable";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import { useGetWarehouses, useToggleWarehouseStatus, type WarehouseFiltersParams } from "../hooks/queries/warehouse.queries";
import type { WarehouseIF } from "../interface/data/warehouse";

const Warehouses = () => {
  const [filters, setFilters] = useState<WarehouseFiltersParams>({ page: 1, limit: 10 });

  const { data, isLoading } = useGetWarehouses(filters);
  const toggleStatus = useToggleWarehouseStatus();

  const warehouses: WarehouseIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? warehouses.length;
    const active = warehouses.filter((w) => w.isActive).length;
    const inactive = total - active;
    const defaults = warehouses.filter((w) => w.isDefault).length;
    return { total, active, inactive, defaults };
  }, [warehouses, meta]);

  const handleToggle = (warehouse: WarehouseIF) => {
    toggleStatus.mutate(warehouse._id, {
      onSuccess: () => toast.success(`${warehouse.name} ${warehouse.isActive ? "deactivated" : "activated"}`),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Warehouses" subtitle="View and manage vendor warehouses across the marketplace" />
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Warehouses" value={stats.total} Icon={WarehouseIcon} color="blue" subtext="All warehouses" />
          <SummaryStatCard label="Active" value={stats.active} Icon={CheckCircle2} color="green" subtext={stats.total ? `${Math.round((stats.active / stats.total) * 100)}% of total` : "0% of total"} />
          <SummaryStatCard label="Inactive" value={stats.inactive} Icon={Ban} color="gray" subtext="Currently disabled" />
          <SummaryStatCard label="Default Warehouses" value={stats.defaults} Icon={Star} color="amber" subtext="Marked as default" />
        </SummaryStatsGrid>
      )}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters withTabs={false} />
            <SkeletonTable rows={8} columns={5} hasAvatar={false} />
          </>
        ) : (
          <>
            <WarehouseFilters filters={filters} onChange={setFilters} />
            <WarehouseTable warehouses={warehouses} onToggle={handleToggle} />
            <Pagination page={meta?.page ?? 1} totalPages={meta?.totalPages ?? 1} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
          </>
        )}
      </Card>
    </div>
  );
};

export default Warehouses;