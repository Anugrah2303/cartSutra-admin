import { useMemo, useState } from "react";
import { Search, X, Users, CheckCircle2, Clock, Ban } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import CustomerTable from "../components/customers/CustomerTable";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import { useGetCustomers, useToggleCustomerBlock, type CustomerFiltersParams } from "../hooks/queries/customer.queries";
import type { CustomerIF } from "../interface/data/customer";
import { AccountStatus } from "../enums/user.enum";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Active", value: AccountStatus.ACTIVE },
  { label: "Pending", value: AccountStatus.PENDING },
  { label: "Blocked", value: AccountStatus.BLOCKED },
];

const Customers = () => {
  const [filters, setFilters] = useState<CustomerFiltersParams>({ page: 1, limit: 10 });
  const [togglingCustomer, setTogglingCustomer] = useState<CustomerIF | null>(null);

  const { data, isLoading } = useGetCustomers(filters);
  const toggleBlock = useToggleCustomerBlock();

  const customers: CustomerIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? customers.length;
    const active = customers.filter((c) => c.accountStatus === AccountStatus.ACTIVE).length;
    const pending = customers.filter((c) => c.accountStatus === AccountStatus.PENDING).length;
    const blocked = customers.filter((c) => c.accountStatus === AccountStatus.BLOCKED).length;
    return { total, active, pending, blocked };
  }, [customers, meta]);

  const set = (patch: Partial<CustomerFiltersParams>) => setFilters((f) => ({ ...f, ...patch, page: 1 }));

  const handleToggleConfirm = () => {
    if (!togglingCustomer) return;
    toggleBlock.mutate(togglingCustomer._id, {
      onSuccess: () => {
        toast.success(
          togglingCustomer.accountStatus === AccountStatus.BLOCKED
            ? `${togglingCustomer.firstName} unblocked`
            : `${togglingCustomer.firstName} blocked`
        );
        setTogglingCustomer(null);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const isBlocking = togglingCustomer?.accountStatus !== AccountStatus.BLOCKED;

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Customers" subtitle="View and manage customer accounts on your marketplace" />
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Customers" value={stats.total} Icon={Users} color="blue" subtext="All customers" />
          <SummaryStatCard label="Active" value={stats.active} Icon={CheckCircle2} color="green" subtext={stats.total ? `${Math.round((stats.active / stats.total) * 100)}% of total` : "0% of total"} />
          <SummaryStatCard label="Pending" value={stats.pending} Icon={Clock} color="amber" subtext="Email not verified" />
          <SummaryStatCard label="Blocked" value={stats.blocked} Icon={Ban} color="red" subtext="Restricted accounts" />
        </SummaryStatsGrid>
      )}

      {!isLoading && (
        <div className="flex gap-1 mb-4 border-b overflow-x-auto" style={{ borderColor: "var(--border-light)" }}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => set({ accountStatus: tab.value })}
              className="px-4 py-2.5 text-sm font-medium cursor-pointer border-b-2 -mb-px whitespace-nowrap"
              style={{
                color: (filters.accountStatus ?? "") === tab.value ? "var(--color-primary)" : "var(--text-muted)",
                borderColor: (filters.accountStatus ?? "") === tab.value ? "var(--color-primary)" : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters />
            <SkeletonTable rows={8} columns={7} hasAvatar />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-5">
              <div className="flex w-full sm:max-w-sm items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-light)" }}>
                <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={filters.search ?? ""}
                  onChange={(e) => set({ search: e.target.value })}
                  placeholder="Search by name, username, or email..."
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>

              {filters.search && (
                <button onClick={() => set({ search: "" })} className="flex items-center gap-1 text-xs cursor-pointer shrink-0" style={{ color: "var(--error)" }}>
                  <X className="h-3.5 w-3.5" />
                  Clear search
                </button>
              )}
            </div>

            <CustomerTable customers={customers} onToggleBlock={setTogglingCustomer} />
            <Pagination
              page={meta?.page ?? 1}
              totalPages={meta?.totalPages ?? 1}
              onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
            />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!togglingCustomer}
        title={isBlocking ? "Block customer" : "Unblock customer"}
        description={
          isBlocking
            ? `Are you sure you want to block "${togglingCustomer?.firstName} ${togglingCustomer?.lastName}"? They won't be able to log in or place orders.`
            : `Are you sure you want to unblock "${togglingCustomer?.firstName} ${togglingCustomer?.lastName}"? They'll regain access to their account.`
        }
        loading={toggleBlock.isPending}
        onConfirm={handleToggleConfirm}
        onClose={() => setTogglingCustomer(null)}
      />
    </div>
  );
};

export default Customers;