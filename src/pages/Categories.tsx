import { useMemo, useState } from "react";
import { Plus, ArchiveRestore, Trash2, Search, X, FolderTree, FolderOpen, Layers, Star, Ban } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import CategoryTree from "../components/categories/CategoryTree";
import CategoryCard from "../components/categories/CategoryCard";
import CategoryForm from "../components/categories/CategoryForm";
import Pagination from "../components/common/Pagination";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useRestoreCategory,
  useDeleteCategoryPermanently,
  useToggleCategoryActive,
} from "../hooks/queries/category.queries";
import { CategoryLevel } from "../enums/category.enum";
import type { categoryIF } from "../interface/data/category";

const PAGE_SIZE = 10;

const Categories = () => {
  const navigate = useNavigate();

  const [trashView, setTrashView] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [selectedNode, setSelectedNode] = useState<categoryIF | null>(null);

  const { data: activeData, isLoading: activeLoading } = useGetCategories("", true);
  const { data: trashData, isLoading: trashLoading } = useGetCategories("?isDeleted=true", trashView);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const restoreCategory = useRestoreCategory();
  const deletePermanently = useDeleteCategoryPermanently();
  const toggleActive = useToggleCategoryActive();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<categoryIF | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<categoryIF | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<categoryIF | null>(null);

  const treeCategories: categoryIF[] = useMemo(() => (Array.isArray(activeData?.data?.data) ? activeData.data.data : []), [activeData]);
  const trashCategories: categoryIF[] = useMemo(() => (Array.isArray(trashData?.data?.data) ? trashData.data.data : []), [trashData]);

  const isLoading = trashView ? trashLoading : activeLoading;

  const stats = useMemo(() => {
    const total = treeCategories.length;
    const root = treeCategories.filter((c) => c.level === CategoryLevel.ROOT).length;
    const sub = total - root;
    const active = treeCategories.filter((c) => c.isActive).length;
    const inactive = total - active;
    return { total, root, sub, active, inactive };
  }, [treeCategories]);

  const filteredCategories = useMemo(() => {
    let list = trashView ? trashCategories : treeCategories;

    if (!trashView && statusFilter) {
      list = list.filter((c) => (statusFilter === "true" ? c.isActive : !c.isActive));
    }

    if (selectedNode) {
      list = list.filter((c) => c._id === selectedNode._id || c.parent === selectedNode._id);
    }

    if (search) list = list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

    return list;
  }, [treeCategories, trashCategories, trashView, statusFilter, search, selectedNode]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE));
  const paginatedCategories = filteredCategories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAddForm = () => { setEditingCategory(null); setFormOpen(true); };
  const openEditForm = (category: categoryIF) => { setEditingCategory(category); setFormOpen(true); };

  const handleFormSubmit = (formData: FormData) => {
    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory._id, data: formData },
        { onSuccess: () => setFormOpen(false), onError: (err) => toast.error(err.message) }
      );
    } else {
      createCategory.mutate(formData, {
        onSuccess: () => setFormOpen(false),
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingCategory) return;
    deleteCategory.mutate(deletingCategory._id, {
      onSuccess: () => { toast.success("Category moved to trash"); setDeletingCategory(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleRestore = (category: categoryIF) => {
    restoreCategory.mutate(category._id, {
      onSuccess: () => toast.success(`${category.name} restored`),
      onError: (err) => toast.error(err.message),
    });
  };

  const handlePermanentDeleteConfirm = () => {
    if (!permanentDeleteTarget) return;
    deletePermanently.mutate(permanentDeleteTarget._id, {
      onSuccess: () => { toast.success("Category permanently deleted"); setPermanentDeleteTarget(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleToggleActive = (category: categoryIF) => {
    toggleActive.mutate(
      { id: category._id, isActive: !category.isActive },
      { onError: (err) => toast.error(err.message) }
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Heading2 title="Category Management" subtitle="Organize your marketplace into categories and sub-categories" />
        <div className="flex gap-2">
          <Button
            value={trashView ? "Back to categories" : "Trash"}
            variant="secondary"
            Icon={trashView ? ArchiveRestore : Trash2}
            options={{ className: "h-4 w-4 inline mr-1" }}
            onClick={() => { setTrashView((v) => !v); setSelectedNode(null); setSearch(""); setPage(1); }}
          />
          {!trashView && (
            <Button value="Add Category" Icon={Plus} options={{ className: "h-4 w-4 inline mr-1" }} onClick={openAddForm} />
          )}
        </div>
      </div>

      {!activeData ? (
        <SkeletonStatsGrid count={5} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Categories" value={stats.total} Icon={FolderTree} color="purple" subtext="All categories" />
          <SummaryStatCard label="Root Categories" value={stats.root} Icon={FolderOpen} color="blue" subtext="Top-level categories" />
          <SummaryStatCard label="Sub Categories" value={stats.sub} Icon={Layers} color="teal" subtext="Child & grandchild" />
          <SummaryStatCard label="Active Categories" value={stats.active} Icon={Star} color="amber" subtext={stats.total ? `${Math.round((stats.active / stats.total) * 100)}% of total` : "0% of total"} />
          <SummaryStatCard label="Inactive Categories" value={stats.inactive} Icon={Ban} color="red" subtext={stats.total ? `${Math.round((stats.inactive / stats.total) * 100)}% of total` : "0% of total"} />
        </SummaryStatsGrid>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <Card>
          <CategoryTree
            categories={treeCategories}
            selectedId={selectedNode?._id ?? null}
            onSelect={(node) => { setSelectedNode(node); setPage(1); }}
          />
        </Card>

        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
            <h3 className="text-sm font-semibold shrink-0" style={{ color: "var(--text-primary)" }}>
              {selectedNode ? `${selectedNode.name} & subcategories` : "All Categories"}
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              {!trashView && (
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value as "" | "true" | "false"); setPage(1); }}
                  className="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer"
                  style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              )}

              <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-light)" }}>
                <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search categories..."
                  className="bg-transparent text-sm outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>

              {selectedNode && (
                <button onClick={() => setSelectedNode(null)} className="flex items-center gap-1 text-xs cursor-pointer" style={{ color: "var(--error)" }}>
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <p className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>Loading categories...</p>
          ) : paginatedCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
                <FolderTree className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {trashView ? "No deleted categories" : "No categories found"}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {trashView ? "Deleted categories will show up here." : "Try adjusting your search or add a new category."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedCategories.map((category) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    parentName={treeCategories.find((c) => c._id === category.parent)?.name}
                    trashView={trashView}
                    onView={(c) => navigate(`/admin/categories/${c._id}`)}
                    onEdit={openEditForm}
                    onDelete={setDeletingCategory}
                    onToggleActive={handleToggleActive}
                    onRestore={handleRestore}
                    onPermanentDelete={setPermanentDeleteTarget}
                  />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </Card>
      </div>

      <Modal open={formOpen} title={editingCategory ? "Edit category" : "Add category"} onClose={() => setFormOpen(false)} maxWidth="max-w-xl">
        <CategoryForm
          initialData={editingCategory}
          categories={treeCategories}
          loading={createCategory.isPending || updateCategory.isPending}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!deletingCategory}
        title="Delete category"
        description={`Are you sure you want to delete "${deletingCategory?.name}"? It will be moved to trash and can be restored or permanently deleted later.`}
        loading={deleteCategory.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingCategory(null)}
      />

      <ConfirmDialog
        open={!!permanentDeleteTarget}
        title="Permanently delete category"
        description={`This will permanently delete "${permanentDeleteTarget?.name}". This cannot be undone.`}
        loading={deletePermanently.isPending}
        onConfirm={handlePermanentDeleteConfirm}
        onClose={() => setPermanentDeleteTarget(null)}
      />
    </div>
  );
};

export default Categories;