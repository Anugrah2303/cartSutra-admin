import { useMemo, useState } from "react";
import { Plus, Search, BadgePercent, ToggleRight, ToggleLeft, CalendarX, ArchiveRestore, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import CouponTable from "../components/coupons/CouponTable";
import CouponForm from "../components/coupons/CouponForm";
import Pagination from "../components/common/Pagination";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import {
  useGetCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  useToggleCoupon,
  useRestoreCoupon,
  useDeleteCouponPermanently,
} from "../hooks/queries/coupon.queries";
import type { CouponIF } from "../interface/data/coupon";
import type { CouponFormOutput } from "../validator/coupon.validator";

const PAGE_SIZE = 8;

const Coupons = () => {
  const [trashView, setTrashView] = useState(false);
  const fetchPath = trashView ? "?isDeleted=true" : "";

  const { data, isLoading } = useGetCoupons(fetchPath);
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();
  const toggleCoupon = useToggleCoupon();
  const restoreCoupon = useRestoreCoupon();
  const deletePermanently = useDeleteCouponPermanently();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponIF | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<CouponIF | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<CouponIF | null>(null);

  const allCoupons: CouponIF[] = useMemo(() => data?.data?.coupons ?? [], [data]);

  const stats = useMemo(() => {
    const total = allCoupons.length;
    const active = allCoupons.filter((c) => c.isActive).length;
    const inactive = total - active;
    const expired = allCoupons.filter((c) => new Date(c.validUntil) < new Date()).length;
    return { total, active, inactive, expired };
  }, [allCoupons]);

  const filteredCoupons = useMemo(
    () => allCoupons.filter((c) => c.code.toLowerCase().includes(search.toLowerCase())),
    [allCoupons, search]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCoupons.length / PAGE_SIZE));
  const paginatedCoupons = filteredCoupons.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAddForm = () => { setEditingCoupon(null); setFormOpen(true); };
  const openEditForm = (coupon: CouponIF) => { setEditingCoupon(coupon); setFormOpen(true); };

  const handleFormSubmit = (data: CouponFormOutput) => {
    if (editingCoupon) {
      updateCoupon.mutate(
        { id: editingCoupon._id, data },
        { onSuccess: () => setFormOpen(false), onError: (err) => toast.error(err.message) }
      );
    } else {
      createCoupon.mutate(data, {
        onSuccess: () => setFormOpen(false),
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingCoupon) return;
    deleteCoupon.mutate(deletingCoupon._id, {
      onSuccess: () => { toast.success("Coupon moved to trash"); setDeletingCoupon(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleToggle = (coupon: CouponIF) => {
    toggleCoupon.mutate(coupon._id, {
      onError: (err) => toast.error(err.message),
    });
  };

  const handleRestore = (coupon: CouponIF) => {
    restoreCoupon.mutate(coupon._id, {
      onSuccess: () => toast.success(`${coupon.code} restored`),
      onError: (err) => toast.error(err.message),
    });
  };

  const handlePermanentDeleteConfirm = () => {
    if (!permanentDeleteTarget) return;
    deletePermanently.mutate(permanentDeleteTarget._id, {
      onSuccess: () => { toast.success("Coupon permanently deleted"); setPermanentDeleteTarget(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Heading2 title="Coupons" subtitle="Manage discount coupons available on your marketplace" />
        <div className="flex gap-2">
          <Button
            value={trashView ? "Back to coupons" : "Trash"}
            variant="secondary"
            Icon={trashView ? ArchiveRestore : Trash2}
            options={{ className: "h-4 w-4 inline mr-1" }}
            onClick={() => { setTrashView((v) => !v); setSearch(""); setPage(1); }}
          />
          {!trashView && (
            <Button value="Add coupon" Icon={Plus} options={{ className: "h-4 w-4 inline mr-1" }} onClick={openAddForm} />
          )}
        </div>
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={4} />
      ) : !trashView ? (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Coupons" value={stats.total} Icon={BadgePercent} color="purple" subtext="All coupons" />
          <SummaryStatCard label="Active" value={stats.active} Icon={ToggleRight} color="green" subtext={stats.total ? `${Math.round((stats.active / stats.total) * 100)}% of total` : "0% of total"} />
          <SummaryStatCard label="Inactive" value={stats.inactive} Icon={ToggleLeft} color="gray" subtext="Currently disabled" />
          <SummaryStatCard label="Expired" value={stats.expired} Icon={CalendarX} color="red" subtext="Past valid-until date" />
        </SummaryStatsGrid>
      ) : null}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters withTabs={false} />
            <SkeletonTable rows={8} columns={6} hasAvatar={false} />
          </>
        ) : (
          <>
            {!trashView && (
              <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border px-3 py-2 mb-5" style={{ borderColor: "var(--border-light)" }}>
                <Search className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search coupon codes..."
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            )}

            <CouponTable
              coupons={paginatedCoupons}
              trashView={trashView}
              onEdit={openEditForm}
              onDelete={setDeletingCoupon}
              onToggle={handleToggle}
              onRestore={handleRestore}
              onPermanentDelete={setPermanentDeleteTarget}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Card>

      <Modal open={formOpen} title={editingCoupon ? "Edit coupon" : "Add coupon"} onClose={() => setFormOpen(false)} maxWidth="max-w-xl">
        <CouponForm
          initialData={editingCoupon}
          loading={createCoupon.isPending || updateCoupon.isPending}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!deletingCoupon}
        title="Delete coupon"
        description={`Are you sure you want to delete "${deletingCoupon?.code}"? It will be moved to trash and can be restored or permanently deleted later.`}
        loading={deleteCoupon.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingCoupon(null)}
      />

      <ConfirmDialog
        open={!!permanentDeleteTarget}
        title="Permanently delete coupon"
        description={`This will permanently delete "${permanentDeleteTarget?.code}". This cannot be undone.`}
        loading={deletePermanently.isPending}
        onConfirm={handlePermanentDeleteConfirm}
        onClose={() => setPermanentDeleteTarget(null)}
      />
    </div>
  );
};

export default Coupons;