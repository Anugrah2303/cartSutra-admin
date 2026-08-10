import { useMemo, useState } from "react";
import { Plus, Package, CheckCircle2, Ban, FileEdit, AlertTriangle, Clock, Trash2, ArchiveRestore } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import ProductFilters from "../components/products/ProductFilters";
import ProductTable from "../components/products/ProductTable";
import ProductForm, { type ProductSubmitPayload } from "../components/products/ProductForm";
import RejectProductModal from "../components/products/RejectProductModal";
import Pagination from "../components/common/Pagination";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useUpdateProductMedia,
  useDeleteProduct,
  useApproveProduct,
  useToggleProductFeatured,
  useRestoreProduct,
  useDeleteProductPermanently,
} from "../hooks/queries/product.queries";
import { useGetCategories } from "../hooks/queries/category.queries";
import { useGetBrands } from "../hooks/queries/brand.queries";
import type { ProductIF } from "../interface/data/product";
import type { ProductFormOutput } from "../validator/product.validator";
import { ProductApprovalStatus, ProductLifecycleStatus } from "../enums/product.enum";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 8;

const buildProductDetailsBody = (data: ProductFormOutput) => ({
  title: data.title,
  description: data.description,
  shortDescription: data.shortDescription || undefined,
  category: data.category,
  brand: data.brand || undefined,
  price: data.price,
  costPrice: data.costPrice,
  discount: data.discount,
  stock: data.stock,
  lowStockAlert: data.lowStockAlert,
  tags: data.tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? [],
});

const buildProductFormData = (data: ProductFormOutput, thumbnailFile: File, productImageFiles: File[]) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  if (data.shortDescription) formData.append("shortDescription", data.shortDescription);
  formData.append("category", data.category);
  if (data.brand) formData.append("brand", data.brand);
  formData.append("price", String(data.price));
  formData.append("costPrice", String(data.costPrice));
  formData.append("discount", String(data.discount));
  formData.append("stock", String(data.stock));
  formData.append("lowStockAlert", String(data.lowStockAlert));
  data.tags?.split(",").map((t) => t.trim()).filter(Boolean).forEach((tag) => formData.append("tags[]", tag));
  formData.append("thumbnailImage", thumbnailFile);
  productImageFiles.forEach((file) => formData.append("productImage", file));
  return formData;
};

const Products = () => {

  const navigate = useNavigate();

  const [trashView, setTrashView] = useState(false);
  const fetchPath = trashView ? "?isDeleted=true" : "";

  const { data, isLoading } = useGetProducts(fetchPath);
  const { data: categoryData } = useGetCategories("?isActive=true");
  const { data: brandData } = useGetBrands();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const updateProductMedia = useUpdateProductMedia();
  const deleteProduct = useDeleteProduct();
  const approveProduct = useApproveProduct();
  const toggleFeatured = useToggleProductFeatured();
  const restoreProduct = useRestoreProduct();
  const deletePermanently = useDeleteProductPermanently();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductIF | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductIF | null>(null);
  const [rejectingProduct, setRejectingProduct] = useState<ProductIF | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<ProductIF | null>(null);

  const allProducts: ProductIF[] = useMemo(
    () => (Array.isArray(data?.data?.data) ? data.data.data : []),
    [data]
  );
  
  const categories = useMemo(() => (Array.isArray(categoryData?.data?.data) ? categoryData.data.data : []), [categoryData]);
  const brands = useMemo(() => (Array.isArray(brandData?.data?.data) ? brandData.data.data : []), [brandData]);

  const stats = useMemo(() => {
    const total = allProducts.length;
    const active = allProducts.filter((p) => p.status === ProductLifecycleStatus.ACTIVE).length;
    const draft = allProducts.filter((p) => p.status === ProductLifecycleStatus.DRAFT).length;
    const outOfStock = allProducts.filter((p) => p.status === ProductLifecycleStatus.OUT_OF_STOCK).length;
    const lowStock = allProducts.filter((p) => p.stock > 0 && p.stock <= p.lowStockAlert).length;
    const pendingApproval = allProducts.filter((p) => p.approvalStatus === ProductApprovalStatus.PENDING).length;
    return { total, active, draft, outOfStock, lowStock, pendingApproval };
  }, [allProducts]);

  const filteredProducts = useMemo(
    () =>
      allProducts.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status ? p.status === status : true;
        return matchesSearch && matchesStatus;
      }),
    [allProducts, search, status]
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAddForm = () => { setEditingProduct(null); setFormOpen(true); };
  const openEditForm = (product: ProductIF) => { setEditingProduct(product); setFormOpen(true); };

  const isSaving = createProduct.isPending || updateProduct.isPending || updateProductMedia.isPending;

  const handleFormSubmit = ({ data, thumbnailFile, productImageFiles }: ProductSubmitPayload) => {
    if (!editingProduct) {
      if (!thumbnailFile) {
        toast.error("Please upload a thumbnail image");
        return;
      }
      createProduct.mutate(buildProductFormData(data, thumbnailFile, productImageFiles), {
        onSuccess: () => setFormOpen(false),
        onError: (err) => toast.error(err.message),
      });
      return;
    }

    updateProduct.mutate(
      { slug: editingProduct.slug, data: buildProductDetailsBody(data) },
      {
        onError: (err) => toast.error(err.message),
        onSuccess: () => {
          if (!thumbnailFile && productImageFiles.length === 0) {
            setFormOpen(false);
            return;
          }
          const mediaForm = new FormData();
          if (thumbnailFile) mediaForm.append("thumbnailImage", thumbnailFile);
          productImageFiles.forEach((file) => mediaForm.append("productImage", file));

          updateProductMedia.mutate(
            { slug: editingProduct.slug, data: mediaForm },
            {
              onSuccess: () => setFormOpen(false),
              onError: (err) => toast.error(`Details saved, but image upload failed: ${err.message}`),
            }
          );
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingProduct) return;
    deleteProduct.mutate(deletingProduct.slug, {
      onSuccess: () => { toast.success("Product moved to trash"); setDeletingProduct(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleApprove = (product: ProductIF) => {
    approveProduct.mutate(
      { slug: product.slug, approvalStatus: ProductApprovalStatus.APPROVED },
      {
        onSuccess: () => toast.success(`${product.title} approved`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectingProduct) return;
    approveProduct.mutate(
      { slug: rejectingProduct.slug, approvalStatus: ProductApprovalStatus.REJECTED, rejectedReason: reason },
      {
        onSuccess: () => { toast.success(`${rejectingProduct.title} rejected`); setRejectingProduct(null); },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleToggleFeatured = (product: ProductIF) => {
    toggleFeatured.mutate(product.slug, {
      onSuccess: () => toast.success(product.featured ? "Removed from featured" : "Added to featured"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleRestore = (product: ProductIF) => {
    restoreProduct.mutate(product.slug, {
      onSuccess: () => toast.success(`${product.title} restored`),
      onError: (err) => toast.error(err.message),
    });
  };

  const handlePermanentDeleteConfirm = () => {
    if (!permanentDeleteTarget) return;
    deletePermanently.mutate(permanentDeleteTarget.slug, {
      onSuccess: () => { toast.success("Product permanently deleted"); setPermanentDeleteTarget(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Heading2 title="Products" subtitle="Manage every product listed on your marketplace" />
        <div className="flex gap-2">
          <Button
            value={trashView ? "Back to products" : "Trash"}
            variant="secondary"
            Icon={trashView ? ArchiveRestore : Trash2}
            options={{ className: "h-4 w-4 inline mr-1" }}
            onClick={() => { setTrashView((v) => !v); setPage(1); }}
          />
          {!trashView && (
            <Button value="Add product" Icon={Plus} options={{ className: "h-4 w-4 inline mr-1" }} onClick={openAddForm} />
          )}
        </div>
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={6} />
      ) : !trashView ? (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Products" value={stats.total} Icon={Package} color="blue" subtext="All products" />
          <SummaryStatCard label="Active" value={stats.active} Icon={CheckCircle2} color="green" subtext={stats.total ? `${Math.round((stats.active / stats.total) * 100)}% of total` : "0% of total"} />
          <SummaryStatCard label="Pending Approval" value={stats.pendingApproval} Icon={Clock} color="amber" subtext="Awaiting review" />
          <SummaryStatCard label="Draft" value={stats.draft} Icon={FileEdit} color="gray" subtext="Not yet published" />
          <SummaryStatCard label="Out of Stock" value={stats.outOfStock} Icon={Ban} color="red" subtext="Needs restocking" />
          <SummaryStatCard label="Low Stock" value={stats.lowStock} Icon={AlertTriangle} color="amber" subtext="Below alert threshold" />
        </SummaryStatsGrid>
      ) : null}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters withTabs={false} />
            <SkeletonTable rows={8} columns={5} hasAvatar responsive={false} />
          </>
        ) : (
          <>
            {!trashView && (
              <ProductFilters
                search={search}
                status={status}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                onStatusChange={(v) => { setStatus(v); setPage(1); }}
              />
            )}
            <ProductTable
              products={paginatedProducts}
              trashView={trashView}
              onView={(product) => navigate(`/admin/products/${product.slug}`)}
              onEdit={openEditForm}
              onDelete={setDeletingProduct}
              onApprove={handleApprove}
              onReject={setRejectingProduct}
              onToggleFeatured={handleToggleFeatured}
              onRestore={handleRestore}
              onPermanentDelete={setPermanentDeleteTarget}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Card>

      <Modal open={formOpen} title={editingProduct ? "Edit product" : "Add product"} onClose={() => setFormOpen(false)} maxWidth="max-w-2xl">
        <ProductForm
          initialData={editingProduct}
          categories={categories}
          brands={brands}
          loading={isSaving}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <RejectProductModal
        open={!!rejectingProduct}
        productTitle={rejectingProduct?.title}
        loading={approveProduct.isPending}
        onConfirm={handleRejectConfirm}
        onClose={() => setRejectingProduct(null)}
      />

      <ConfirmDialog
        open={!!deletingProduct}
        title="Delete product"
        description={`Are you sure you want to delete "${deletingProduct?.title}"? It will be moved to trash and can be restored or permanently deleted later.`}
        loading={deleteProduct.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingProduct(null)}
      />

      <ConfirmDialog
        open={!!permanentDeleteTarget}
        title="Permanently delete product"
        description={`This will permanently delete "${permanentDeleteTarget?.title}" and all its images. This cannot be undone.`}
        loading={deletePermanently.isPending}
        onConfirm={handlePermanentDeleteConfirm}
        onClose={() => setPermanentDeleteTarget(null)}
      />
    </div>
  );
};

export default Products;