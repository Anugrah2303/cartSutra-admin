import { useMemo, useState } from "react";
import { Plus, Search, Tags, Star, Globe, ImageOff, ArchiveRestore, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import BrandTable from "../components/brands/BrandTable";
import BrandForm from "../components/brands/BrandForm";
import Pagination from "../components/common/Pagination";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import { useGetBrands, useCreateBrand, useUpdateBrand, useDeleteBrand, useRestoreBrand, useDeleteBrandPermanently } from "../hooks/queries/brand.queries";
import type BrandIF from "../interface/data/brand";

const PAGE_SIZE = 8;

const Brands = () => {

  const [trashView, setTrashView] = useState(false);
  const fetchPath = trashView ? "?isDeleted=true" : "";

  const { data, isLoading } = useGetBrands(fetchPath);
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();
  const restoreBrand = useRestoreBrand();
  const deletePermanently = useDeleteBrandPermanently();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandIF | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<BrandIF | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<BrandIF | null>(null);

  const allBrands: BrandIF[] = useMemo(() => (Array.isArray(data?.data?.data) ? data.data.data : []), [data]);

  const stats = useMemo(() => {
    const total = allBrands.length;
    const featured = allBrands.filter((b) => b.isFeatured).length;
    const withWebsite = allBrands.filter((b) => !!b.website).length;
    const noLogo = allBrands.filter((b) => !b.avatar?.URL).length;
    return { total, featured, withWebsite, noLogo };
  }, [allBrands]);

  const filteredBrands = useMemo(
    () => allBrands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())),
    [allBrands, search]
  );

  const totalPages = Math.max(1, Math.ceil(filteredBrands.length / PAGE_SIZE));
  const paginatedBrands = filteredBrands.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAddForm = () => { setEditingBrand(null); setFormOpen(true); };
  const openEditForm = (brand: BrandIF) => { setEditingBrand(brand); setFormOpen(true); };

  const handleFormSubmit = (formData: FormData) => {
    if (editingBrand) {
      updateBrand.mutate(
        { id: editingBrand._id, data: formData },
        { onSuccess: () => setFormOpen(false), onError: (err) => toast.error(err.message) }
      );
    } else {
      createBrand.mutate(formData, {
        onSuccess: () => setFormOpen(false),
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingBrand) return;
    deleteBrand.mutate(deletingBrand._id, {
      onSuccess: () => { toast.success("Brand moved to trash"); setDeletingBrand(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleRestore = (brand: BrandIF) => {
    restoreBrand.mutate(brand._id, {
      onSuccess: () => toast.success(`${brand.name} restored`),
      onError: (err) => toast.error(err.message),
    });
  };

  const handlePermanentDeleteConfirm = () => {
    if (!permanentDeleteTarget) return;
    deletePermanently.mutate(permanentDeleteTarget._id, {
      onSuccess: () => { toast.success("Brand permanently deleted"); setPermanentDeleteTarget(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Heading2 title="Brands" subtitle="Manage the brands available to sellers on your marketplace" />
        <div className="flex gap-2">
          <Button
            value={trashView ? "Back to brands" : "Trash"}
            variant="secondary"
            Icon={trashView ? ArchiveRestore : Trash2}
            options={{ className: "h-4 w-4 inline mr-1" }}
            onClick={() => { setTrashView((v) => !v); setSearch(""); setPage(1); }}
          />
          {!trashView && (
            <Button value="Add brand" Icon={Plus} options={{ className: "h-4 w-4 inline mr-1" }} onClick={openAddForm} />
          )}
        </div>
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={4} />
      ) : !trashView ? (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Brands" value={stats.total} Icon={Tags} color="purple" subtext="All brands" />
          <SummaryStatCard label="Featured" value={stats.featured} Icon={Star} color="amber" subtext={stats.total ? `${Math.round((stats.featured / stats.total) * 100)}% of total` : "0% of total"} />
          <SummaryStatCard label="With Website" value={stats.withWebsite} Icon={Globe} color="blue" subtext="Have a linked site" />
          <SummaryStatCard label="Missing Logo" value={stats.noLogo} Icon={ImageOff} color="red" subtext="Needs a brand logo" />
        </SummaryStatsGrid>
      ) : null}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters withTabs={false} />
            <SkeletonTable rows={8} columns={4} hasAvatar={false} />
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
                  placeholder="Search brands..."
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            )}

            <BrandTable
              brands={paginatedBrands}
              trashView={trashView}
              onEdit={openEditForm}
              onDelete={setDeletingBrand}
              onRestore={handleRestore}
              onPermanentDelete={setPermanentDeleteTarget}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Card>

      <Modal open={formOpen} title={editingBrand ? "Edit brand" : "Add brand"} onClose={() => setFormOpen(false)} maxWidth="max-w-xl">
        <BrandForm
          initialData={editingBrand}
          loading={createBrand.isPending || updateBrand.isPending}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!deletingBrand}
        title="Delete brand"
        description={`Are you sure you want to delete "${deletingBrand?.name}"? It will be moved to trash and can be restored or permanently deleted later.`}
        loading={deleteBrand.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingBrand(null)}
      />

      <ConfirmDialog
        open={!!permanentDeleteTarget}
        title="Permanently delete brand"
        description={`This will permanently delete "${permanentDeleteTarget?.name}". This cannot be undone.`}
        loading={deletePermanently.isPending}
        onConfirm={handlePermanentDeleteConfirm}
        onClose={() => setPermanentDeleteTarget(null)}
      />
    </div>
  );
};

export default Brands;