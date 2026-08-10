// src/pages/GiftCards.tsx
import { useMemo, useState } from "react";
import { Plus, Search, X, Gift, Wallet, Ban, CalendarX, ArchiveRestore, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import GiftCardTable from "../components/giftCards/GiftCardTable";
import GiftCardForm, { type GiftCardFormOutput } from "../components/giftCards/GiftCardForm";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import {
  useGetGiftCards,
  useCreateGiftCard,
  useToggleGiftCard,
  useDeleteGiftCard,
  useRestoreGiftCard,
  useDeleteGiftCardPermanently,
  type GiftCardFiltersParams,
} from "../hooks/queries/giftCard.queries";
import type { GiftCardIF } from "../interface/data/giftCard";
import { GiftCardStatus } from "../enums/giftCard.enum";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Active", value: GiftCardStatus.ACTIVE },
  { label: "Redeemed", value: GiftCardStatus.REDEEMED },
  { label: "Expired", value: GiftCardStatus.EXPIRED },
  { label: "Disabled", value: GiftCardStatus.DISABLED },
];

const GiftCards = () => {
  const [trashView, setTrashView] = useState(false);
  const [filters, setFilters] = useState<GiftCardFiltersParams>({ page: 1, limit: 10 });
  const [formOpen, setFormOpen] = useState(false);
  const [deletingCard, setDeletingCard] = useState<GiftCardIF | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<GiftCardIF | null>(null);

  const effectiveFilters: GiftCardFiltersParams = {
    ...filters,
    isDeleted: trashView ? "true" : "false",
    // status filter only makes sense outside trash
    status: trashView ? undefined : filters.status,
  };

  const { data, isLoading } = useGetGiftCards(effectiveFilters);
  const createGiftCard = useCreateGiftCard();
  const toggleGiftCard = useToggleGiftCard();
  const deleteGiftCard = useDeleteGiftCard();
  const restoreGiftCard = useRestoreGiftCard();
  const deletePermanently = useDeleteGiftCardPermanently();

  const giftCards: GiftCardIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? giftCards.length;
    const activeBalance = giftCards
      .filter((gc) => gc.status === GiftCardStatus.ACTIVE)
      .reduce((sum, gc) => sum + gc.balance, 0);
    const disabled = giftCards.filter((gc) => gc.status === GiftCardStatus.DISABLED).length;
    const expired = giftCards.filter((gc) => gc.status === GiftCardStatus.EXPIRED).length;
    return { total, activeBalance, disabled, expired };
  }, [giftCards, meta]);

  const set = (patch: Partial<GiftCardFiltersParams>) => setFilters((f) => ({ ...f, ...patch, page: 1 }));

  const handleToggleTrash = () => {
    setTrashView((v) => !v);
    setFilters({ page: 1, limit: 10 });
  };

  const handleCreate = (formData: GiftCardFormOutput) => {
    createGiftCard.mutate(formData, {
      onSuccess: () => { toast.success("Gift card created"); setFormOpen(false); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleToggle = (gc: GiftCardIF) => {
    toggleGiftCard.mutate(gc._id, { onError: (err) => toast.error(err.message) });
  };

  const handleDeleteConfirm = () => {
    if (!deletingCard) return;
    deleteGiftCard.mutate(deletingCard._id, {
      onSuccess: () => { toast.success("Gift card moved to trash"); setDeletingCard(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleRestore = (gc: GiftCardIF) => {
    restoreGiftCard.mutate(gc._id, {
      onSuccess: () => toast.success(`${gc.code} restored`),
      onError: (err) => toast.error(err.message),
    });
  };

  const handlePermanentDeleteConfirm = () => {
    if (!permanentDeleteTarget) return;
    deletePermanently.mutate(permanentDeleteTarget._id, {
      onSuccess: () => { toast.success("Gift card permanently deleted"); setPermanentDeleteTarget(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Heading2 title="Gift Cards" subtitle="Issue and manage gift cards for your marketplace" />
        <div className="flex gap-2">
          <Button
            value={trashView ? "Back to gift cards" : "Trash"}
            variant="secondary"
            Icon={trashView ? ArchiveRestore : Trash2}
            options={{ className: "h-4 w-4 inline mr-1" }}
            onClick={handleToggleTrash}
          />
          {!trashView && (
            <Button value="Issue gift card" Icon={Plus} options={{ className: "h-4 w-4 inline mr-1" }} onClick={() => setFormOpen(true)} />
          )}
        </div>
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={4} />
      ) : !trashView ? (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Gift Cards" value={stats.total} Icon={Gift} color="purple" subtext="All issued cards" />
          <SummaryStatCard label="Active Balance" value={`₹${stats.activeBalance.toLocaleString()}`} Icon={Wallet} color="green" subtext="Sum of active cards (this page)" />
          <SummaryStatCard label="Disabled" value={stats.disabled} Icon={Ban} color="amber" subtext="Manually disabled" />
          <SummaryStatCard label="Expired" value={stats.expired} Icon={CalendarX} color="red" subtext="Past expiry date" />
        </SummaryStatsGrid>
      ) : null}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters withTabs={!trashView} />
            <SkeletonTable rows={8} columns={6} hasAvatar={false} />
          </>
        ) : (
          <>
            {!trashView && (
              <div className="flex gap-1 mb-4 border-b overflow-x-auto" style={{ borderColor: "var(--border-light)" }}>
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => set({ status: tab.value })}
                    className="px-4 py-2.5 text-sm font-medium cursor-pointer border-b-2 -mb-px whitespace-nowrap"
                    style={{
                      color: (filters.status ?? "") === tab.value ? "var(--color-primary)" : "var(--text-muted)",
                      borderColor: (filters.status ?? "") === tab.value ? "var(--color-primary)" : "transparent",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-5">
              <div className="flex w-full sm:max-w-sm items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-light)" }}>
                <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={filters.search ?? ""}
                  onChange={(e) => set({ search: e.target.value })}
                  placeholder="Search by code..."
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
              {filters.search && (
                <button onClick={() => set({ search: "" })} className="flex items-center gap-1 text-xs cursor-pointer shrink-0" style={{ color: "var(--error)" }}>
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>

            <GiftCardTable
              giftCards={giftCards}
              trashView={trashView}
              onToggle={handleToggle}
              onDelete={setDeletingCard}
              onRestore={handleRestore}
              onPermanentDelete={setPermanentDeleteTarget}
            />
            <Pagination page={meta?.page ?? 1} totalPages={meta?.totalPages ?? 1} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
          </>
        )}
      </Card>

      <Modal open={formOpen} title="Issue gift card" onClose={() => setFormOpen(false)} maxWidth="max-w-md">
        <GiftCardForm loading={createGiftCard.isPending} onSubmit={handleCreate} onCancel={() => setFormOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={!!deletingCard}
        title="Delete gift card"
        description={`Are you sure you want to delete "${deletingCard?.code}"? It will be moved to trash and can be restored or permanently deleted later.`}
        loading={deleteGiftCard.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingCard(null)}
      />

      <ConfirmDialog
        open={!!permanentDeleteTarget}
        title="Permanently delete gift card"
        description={`This will permanently delete "${permanentDeleteTarget?.code}". This cannot be undone.`}
        loading={deletePermanently.isPending}
        onConfirm={handlePermanentDeleteConfirm}
        onClose={() => setPermanentDeleteTarget(null)}
      />
    </div>
  );
};

export default GiftCards;