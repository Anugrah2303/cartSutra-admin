import { useMemo, useState } from "react";
import { Search, Store, Clock, CheckCircle2, XCircle, Ban } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import VendorTable from "../components/vendors/VendorTable";
import RejectVendorModal from "../components/vendors/RejectVendorModal";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import {
  useGetVendors,
  useApproveVendor,
  useRejectVendor,
  useBlockVendor,
  useDeleteVendor,
} from "../hooks/queries/vendor.queries";
import type { VendorIF } from "../interface/data/vendor";
import { VendorApprovalStatus } from "../enums/vendor.enum";

const PAGE_SIZE = 8;

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: VendorApprovalStatus.PENDING },
  { label: "Under review", value: VendorApprovalStatus.UNDER_REVIEW },
  { label: "Approved", value: VendorApprovalStatus.APPROVED },
  { label: "Rejected", value: VendorApprovalStatus.REJECTED },
  { label: "Suspended", value: VendorApprovalStatus.SUSPENDED },
];

const Vendors = () => {
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("");
  const [page, setPage] = useState(1);

  const [rejectingVendor, setRejectingVendor] = useState<VendorIF | null>(null);
  const [blockingVendor, setBlockingVendor] = useState<VendorIF | null>(null);
  const [deletingVendor, setDeletingVendor] = useState<VendorIF | null>(null);

  const { data, isLoading } = useGetVendors(search, statusTab || undefined);
  const approveVendor = useApproveVendor();
  const rejectVendor = useRejectVendor();
  const blockVendor = useBlockVendor();
  const deleteVendor = useDeleteVendor();

  const allVendors: VendorIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? allVendors.length;
    const pending = allVendors.filter((v) => v.approvalStatus === VendorApprovalStatus.PENDING || v.approvalStatus === VendorApprovalStatus.UNDER_REVIEW).length;
    const approved = allVendors.filter((v) => v.approvalStatus === VendorApprovalStatus.APPROVED).length;
    const rejected = allVendors.filter((v) => v.approvalStatus === VendorApprovalStatus.REJECTED).length;
    const suspended = allVendors.filter((v) => v.approvalStatus === VendorApprovalStatus.SUSPENDED).length;
    return { total, pending, approved, rejected, suspended };
  }, [allVendors, meta]);

  const totalPages = Math.max(1, Math.ceil(allVendors.length / PAGE_SIZE));
  const paginatedVendors = allVendors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleApprove = (vendor: VendorIF) => {
    approveVendor.mutate(vendor._id, {
      onSuccess: () => toast.success(`${vendor.shopName} approved`),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectingVendor) return;
    rejectVendor.mutate({ id: rejectingVendor._id, rejectedReason: reason }, {
      onSuccess: () => { toast.success(`${rejectingVendor.shopName} rejected`); setRejectingVendor(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleBlockConfirm = () => {
    if (!blockingVendor) return;
    blockVendor.mutate(blockingVendor._id, {
      onSuccess: () => { toast.success(`${blockingVendor.shopName} suspended`); setBlockingVendor(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingVendor) return;
    deleteVendor.mutate(deletingVendor._id, {
      onSuccess: () => { toast.success(`${deletingVendor.shopName} deleted`); setDeletingVendor(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Vendors" subtitle="Review, approve, and manage sellers on your marketplace" />
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={5} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Vendors" value={stats.total} Icon={Store} color="blue" subtext="All vendors" />
          <SummaryStatCard label="Pending Review" value={stats.pending} Icon={Clock} color="amber" subtext="Awaiting decision" />
          <SummaryStatCard label="Approved" value={stats.approved} Icon={CheckCircle2} color="green" subtext="Active sellers" />
          <SummaryStatCard label="Rejected" value={stats.rejected} Icon={XCircle} color="red" subtext="Rejected applications" />
          <SummaryStatCard label="Suspended" value={stats.suspended} Icon={Ban} color="gray" subtext="Blocked vendors" />
        </SummaryStatsGrid>
      )}

      {!isLoading && (
        <div className="flex gap-1 mb-4 border-b overflow-x-auto" style={{ borderColor: "var(--border-light)" }}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setStatusTab(tab.value); setPage(1); }}
              className="px-4 py-2.5 text-sm font-medium cursor-pointer border-b-2 -mb-px whitespace-nowrap"
              style={{
                color: statusTab === tab.value ? "var(--color-primary)" : "var(--text-muted)",
                borderColor: statusTab === tab.value ? "var(--color-primary)" : "transparent",
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
            <SkeletonTable rows={8} columns={6} hasAvatar />
          </>
        ) : (
          <>
            <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border px-3 py-2 mb-5" style={{ borderColor: "var(--border-light)" }}>
              <Search className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search vendors..."
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            <VendorTable
              vendors={paginatedVendors}
              onApprove={handleApprove}
              onReject={setRejectingVendor}
              onBlock={setBlockingVendor}
              onDelete={setDeletingVendor}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Card>

      <RejectVendorModal
        open={!!rejectingVendor}
        shopName={rejectingVendor?.shopName}
        loading={rejectVendor.isPending}
        onConfirm={handleRejectConfirm}
        onClose={() => setRejectingVendor(null)}
      />

      <ConfirmDialog
        open={!!blockingVendor}
        title="Suspend vendor"
        description={`Are you sure you want to suspend "${blockingVendor?.shopName}"? Their products will no longer be visible.`}
        loading={blockVendor.isPending}
        onConfirm={handleBlockConfirm}
        onClose={() => setBlockingVendor(null)}
      />

      <ConfirmDialog
        open={!!deletingVendor}
        title="Delete vendor"
        description={`Are you sure you want to delete "${deletingVendor?.shopName}"? This can't be undone.`}
        loading={deleteVendor.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingVendor(null)}
      />
    </div>
  );
};

export default Vendors;