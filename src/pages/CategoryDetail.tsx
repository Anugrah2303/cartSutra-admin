import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, RotateCcw, Trash, FolderTree } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import DetailRow from "../components/vendors/DetailRow";
import CategoryForm from "../components/categories/CategoryForm";
import StatusToggle from "../components/common/StatusToggle";
import Skeleton from "../components/common/skeletons/Skeleton";
import SkeletonDetailRows from "../components/common/skeletons/SkeletonDetailRows";
import {
  useGetCategoryById,
  useGetCategories,
  useUpdateCategory,
  useDeleteCategory,
  useRestoreCategory,
  useDeleteCategoryPermanently,
  useToggleCategoryActive,
} from "../hooks/queries/category.queries";
import { CategoryLevel } from "../enums/category.enum";
import type { categoryIF } from "../interface/data/category";

const LEVEL_LABEL: Record<string, string> = {
  [CategoryLevel.ROOT]: "Root",
  [CategoryLevel.CHILD]: "Child",
  [CategoryLevel.GRANDCHILD]: "Grandchild",
};

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetCategoryById(id!);
  const { data: allCategoriesData } = useGetCategories();

  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const restoreCategory = useRestoreCategory();
  const deletePermanently = useDeleteCategoryPermanently();
  const toggleActive = useToggleCategoryActive();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);

  const category = data?.data;
  const allCategories: categoryIF[] = Array.isArray(allCategoriesData?.data?.data) ? allCategoriesData.data.data : [];

  const children = allCategories.filter((c) => c.parent === category?._id);
  const parent = allCategories.find((c) => c._id === category?.parent);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Card title="Category details"><SkeletonDetailRows rows={4} /></Card>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm mb-3" style={{ color: "var(--error)" }}>Category not found.</p>
        <Button value="Back to categories" variant="secondary" onClick={() => navigate("/admin/categories")} />
      </div>
    );
  }

  const handleEditSubmit = (formData: FormData) => {
    updateCategory.mutate(
      { id: category._id, data: formData },
      { onSuccess: () => { toast.success("Category updated"); setEditOpen(false); }, onError: (err) => toast.error(err.message) }
    );
  };

  const handleDeleteConfirm = () => {
    deleteCategory.mutate(category._id, {
      onSuccess: () => { toast.success("Category moved to trash"); setDeleteOpen(false); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleRestore = () => {
    restoreCategory.mutate(category._id, {
      onSuccess: () => toast.success("Category restored"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handlePermanentDeleteConfirm = () => {
    deletePermanently.mutate(category._id, {
      onSuccess: () => { toast.success("Category permanently deleted"); navigate("/admin/categories"); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleToggleActive = () => {
    toggleActive.mutate(
      { id: category._id, isActive: !category.isActive },
      { onError: (err) => toast.error(err.message) }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate("/admin/categories")} className="flex items-center gap-1.5 text-sm cursor-pointer w-fit" style={{ color: "var(--text-muted)" }}>
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {category.avatar?.URL ? (
            <img src={category.avatar.URL} alt={category.name} className="h-16 w-16 rounded-xl object-cover border" style={{ borderColor: "var(--border-light)" }} />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--bg-soft)" }}>
              <FolderTree className="h-7 w-7" style={{ color: "var(--color-primary)" }} />
            </div>
          )}
          <div>
            <Heading2 title={category.name} />
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {LEVEL_LABEL[category.level]} · <code>{category.slug}</code>
              {category.isDeleted && <span className="ml-2" style={{ color: "var(--error)" }}>(in trash)</span>}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!category.isDeleted && (
            <>
              <StatusToggle isActive={category.isActive} onToggle={handleToggleActive} />
              <Button value="Edit" Icon={Pencil} options={{ className: "h-4 w-4 inline mr-1" }} variant="secondary" onClick={() => setEditOpen(true)} />
              <Button value="Delete" Icon={Trash2} options={{ className: "h-4 w-4 inline mr-1" }} variant="danger" onClick={() => setDeleteOpen(true)} />
            </>
          )}
          {category.isDeleted && (
            <>
              <Button value="Restore" Icon={RotateCcw} options={{ className: "h-4 w-4 inline mr-1" }} disable={restoreCategory.isPending} onClick={handleRestore} />
              <Button value="Delete permanently" Icon={Trash} options={{ className: "h-4 w-4 inline mr-1" }} variant="danger" onClick={() => setPermanentDeleteOpen(true)} />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Category details">
          {category.description && <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{category.description}</p>}
          <DetailRow label="Parent category" value={parent?.name ?? (category.level === CategoryLevel.ROOT ? "None (top-level)" : "—")} />
          <DetailRow label="Level" value={LEVEL_LABEL[category.level]} />
          <DetailRow label="Status" value={category.isActive ? "Active" : "Inactive"} />
          <DetailRow label="Created" value={format(new Date(category.createdAt), "MMM d, yyyy 'at' h:mm a")} />
          <DetailRow label="Last updated" value={format(new Date(category.updatedAt), "MMM d, yyyy 'at' h:mm a")} />
        </Card>

        <Card title={`Subcategories (${children.length})`}>
          {children.length === 0 ? (
            <p className="py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>No subcategories yet.</p>
          ) : (
            <div className="flex flex-col divide-y" style={{ borderColor: "var(--border-light)" }}>
              {children.map((child) => (
                <button
                  key={child._id}
                  onClick={() => navigate(`/admin/categories/${child._id}`)}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0 cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    {child.avatar?.URL ? (
                      <img src={child.avatar.URL} alt={child.name} className="h-8 w-8 rounded-md object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold" style={{ backgroundColor: "var(--bg-soft)", color: "var(--color-primary)" }}>
                        {child.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>{child.name}</span>
                  </div>
                  <span className="text-xs" style={{ color: child.isActive ? "var(--success)" : "var(--text-muted)" }}>
                    {child.isActive ? "Active" : "Inactive"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal open={editOpen} title="Edit category" onClose={() => setEditOpen(false)} maxWidth="max-w-xl">
        <CategoryForm
          initialData={category}
          categories={allCategories}
          loading={updateCategory.isPending}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete category"
        description={`Are you sure you want to delete "${category.name}"? It will be moved to trash.`}
        loading={deleteCategory.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />

      <ConfirmDialog
        open={permanentDeleteOpen}
        title="Permanently delete category"
        description={`This will permanently delete "${category.name}". This cannot be undone.`}
        loading={deletePermanently.isPending}
        onConfirm={handlePermanentDeleteConfirm}
        onClose={() => setPermanentDeleteOpen(false)}
      />
    </div>
  );
};

export default CategoryDetail;