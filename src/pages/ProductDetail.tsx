import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft, Check, X, Star, Pencil, Trash2, RotateCcw, Trash,
  Eye, Heart, ShoppingBag, TrendingUp,
} from "lucide-react";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import DetailRow from "../components/vendors/DetailRow";
import ProductForm, { type ProductSubmitPayload } from "../components/products/ProductForm";
import RejectProductModal from "../components/products/RejectProductModal";
import {
  useGetProductBySlug,
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
import { ProductApprovalStatus } from "../enums/product.enum";
import type { ProductFormOutput } from "../validator/product.validator";
import Skeleton from "../components/common/skeletons/Skeleton";
import SkeletonCircle from "../components/common/skeletons/SkeletonCircle";
import SkeletonStatCard from "../components/common/skeletons/SkeletonStatCard";
import SkeletonDetailRows from "../components/common/skeletons/SkeletonDetailRows";
import ProductGalleryEditor from "../components/products/ProductGalleryEditor";

const APPROVAL_STYLES: Record<string, string> = {
  [ProductApprovalStatus.PENDING]: "bg-amber-100 text-amber-700",
  [ProductApprovalStatus.APPROVED]: "bg-green-100 text-green-700",
  [ProductApprovalStatus.REJECTED]: "bg-red-100 text-red-700",
};

const buildProductDetailsBody = (data: ProductFormOutput) => ({
  title: data.title,
  description: data.description,
  shortDescription: data.shortDescription || undefined,
  category: data.category,
  brand: data.brand || undefined,
  price: data.price,
  discount: data.discount,
  stock: data.stock,
  lowStockAlert: data.lowStockAlert,
  tags: data.tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? [],
});

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetProductBySlug(slug!);
  const { data: categoryData } = useGetCategories();
  const { data: brandData } = useGetBrands();

  const updateProduct = useUpdateProduct();
  const updateProductMedia = useUpdateProductMedia();
  const deleteProduct = useDeleteProduct();
  const approveProduct = useApproveProduct();
  const toggleFeatured = useToggleProductFeatured();
  const restoreProduct = useRestoreProduct();
  const deletePermanently = useDeleteProductPermanently();

  const [editOpen, setEditOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);

  const product = data?.data;
  const categories = Array.isArray(categoryData?.data?.data) ? categoryData.data.data : [];
  const brands = Array.isArray(brandData?.data?.data) ? brandData.data.data : [];

  const categoryName = categories.find((c) => c._id === product?.category)?.name;
  const brandName = brands.find((b) => b._id === product?.brand)?.name;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-4">
          <SkeletonCircle size="h-16 w-16" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Overview"><SkeletonDetailRows rows={4} /></Card>
          <Card title="Gallery"><SkeletonDetailRows rows={4} /></Card>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm mb-3" style={{ color: "var(--error)" }}>Product not found.</p>
        <Button value="Back to products" variant="secondary" onClick={() => navigate("/admin/products")} />
      </div>
    );
  }

  const handleFormSubmit = ({ data: formData, thumbnailFile, productImageFiles }: ProductSubmitPayload) => {
    updateProduct.mutate(
      { slug: product.slug, data: buildProductDetailsBody(formData) },
      {
        onSuccess: () => {
          if (!thumbnailFile && productImageFiles.length === 0) {
            toast.success("Product updated");
            setEditOpen(false);
            return;
          }
          const mediaForm = new FormData();
          if (thumbnailFile) mediaForm.append("thumbnailImage", thumbnailFile);
          productImageFiles.forEach((file: File) => mediaForm.append("productImage", file));

          updateProductMedia.mutate(
            { slug: product.slug, data: mediaForm },
            {
              onSuccess: () => { toast.success("Product updated"); setEditOpen(false); },
            }
          );
        },
      }
    );
  };

  const handleApprove = () => {
    approveProduct.mutate(
      { slug: product.slug, approvalStatus: ProductApprovalStatus.APPROVED },
      {
        onSuccess: () => toast.success("Product approved"),
      }
    );
  };

  const handleRejectConfirm = (reason: string) => {
    approveProduct.mutate(
      { slug: product.slug, approvalStatus: ProductApprovalStatus.REJECTED, rejectedReason: reason },
      {
        onSuccess: () => { toast.success("Product rejected"); setRejectOpen(false); },
      }
    );
  };

  const handleToggleFeatured = () => {
    toggleFeatured.mutate(product.slug, {
      onSuccess: () => toast.success(product.featured ? "Removed from featured" : "Added to featured"),
    });
  };

  const handleDeleteConfirm = () => {
    deleteProduct.mutate(product.slug, {
      onSuccess: () => { toast.success("Product moved to trash"); setDeleteOpen(false); },
    });
  };

  const handleRestore = () => {
    restoreProduct.mutate(product.slug, {
      onSuccess: () => toast.success("Product restored"),
    });
  };

  const handlePermanentDeleteConfirm = () => {
    deletePermanently.mutate(product.slug, {
      onSuccess: () => { toast.success("Product permanently deleted"); navigate("/admin/products"); },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate("/admin/products")} className="flex items-center gap-1.5 text-sm cursor-pointer w-fit" style={{ color: "var(--text-muted)" }}>
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img src={product.thumbnailImage?.URL} alt={product.title} className="h-16 w-16 rounded-xl object-cover" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Heading2 title={product.title} />
              <Badge status={product.status} />
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${APPROVAL_STYLES[product.approvalStatus] ?? "bg-gray-100 text-gray-600"}`}>
                {product.approvalStatus}
              </span>
              {product.featured && <Star className="h-4 w-4 fill-current" style={{ color: "var(--warning)" }} />}
              {product.isDeleted && (
                <span className="rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600">Deleted</span>
              )}
            </div>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{product.slug}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.isDeleted ? (
            <>
              <Button value="Restore" Icon={RotateCcw} options={{ className: "h-4 w-4 inline mr-1" }} disable={restoreProduct.isPending} onClick={handleRestore} />
              <Button value="Delete permanently" Icon={Trash} options={{ className: "h-4 w-4 inline mr-1" }} variant="danger" onClick={() => setPermanentDeleteOpen(true)} />
            </>
          ) : (
            <>
              {product.approvalStatus !== ProductApprovalStatus.APPROVED && (
                <Button value="Approve" Icon={Check} options={{ className: "h-4 w-4 inline mr-1" }} variant="success" disable={approveProduct.isPending} onClick={handleApprove} />
              )}
              {product.approvalStatus !== ProductApprovalStatus.REJECTED && (
                <Button value="Reject" Icon={X} options={{ className: "h-4 w-4 inline mr-1" }} variant="secondary" onClick={() => setRejectOpen(true)} />
              )}
              <Button
                value={product.featured ? "Unfeature" : "Feature"}
                Icon={Star}
                options={{ className: "h-4 w-4 inline mr-1" }}
                variant="ghost"
                disable={toggleFeatured.isPending}
                onClick={handleToggleFeatured}
              />
              <Button value="Edit" Icon={Pencil} options={{ className: "h-4 w-4 inline mr-1" }} onClick={() => setEditOpen(true)} />
              <Button value="Delete" Icon={Trash2} options={{ className: "h-4 w-4 inline mr-1" }} variant="danger" onClick={() => setDeleteOpen(true)} />
            </>
          )}
        </div>
      </div>

      {product.approvalStatus === ProductApprovalStatus.REJECTED && product.rejectedReason && (
        <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--error)", backgroundColor: "var(--bg-soft)", color: "var(--error)" }}>
          <strong>Rejection reason:</strong> {product.rejectedReason}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Price</p>
          <p className="text-xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>₹{product.price.toLocaleString()}</p>
          {product.discount > 0 && <p className="text-xs mt-0.5" style={{ color: "var(--success)" }}>{product.discount}% off</p>}
        </Card>
        <Card>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Stock</p>
          <p className="text-xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{product.stock}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Alert at {product.lowStockAlert}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Sold</p>
          </div>
          <p className="text-xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{product.soldCount}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Rating</p>
          </div>
          <p className="text-xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{product.rating.toFixed(1)} <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>({product.totalReviews})</span></p>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>{product.totalViews}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>{product.totalWishlist}</span>
            </div>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Views / Wishlisted</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Overview">
          {product.shortDescription && (
            <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{product.shortDescription}</p>
          )}
          <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{product.description}</p>
          <DetailRow label="Category" value={categoryName} />
          <DetailRow label="Brand" value={brandName ?? "—"} />
          <DetailRow label="Cost price" value={`₹${product.costPrice}`} />
          <DetailRow label="Shipping cost" value={`₹${product.shippingCost}`} />
          <DetailRow label="Dimensions (L×W×H)" value={`${product.length ?? "—"} × ${product.width ?? "—"} × ${product.height ?? "—"}`} />
          <DetailRow label="Weight" value={product.weight ? `${product.weight} kg` : undefined} />
          {product.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full px-2.5 py-1 text-xs" style={{ backgroundColor: "var(--bg-soft)", color: "var(--text-secondary)" }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Card>

        <Card title="Media">
          <ProductGalleryEditor product={product} />
        </Card>

      </div>

      {product.variants && product.variants.length > 0 && (
        <Card title={`Variants (${product.variants.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <th className="pb-2 font-medium" style={{ color: "var(--text-muted)" }}>SKU</th>
                  <th className="pb-2 font-medium" style={{ color: "var(--text-muted)" }}>Attributes</th>
                  <th className="pb-2 font-medium" style={{ color: "var(--text-muted)" }}>Price</th>
                  <th className="pb-2 font-medium" style={{ color: "var(--text-muted)" }}>Stock</th>
                  <th className="pb-2 font-medium" style={{ color: "var(--text-muted)" }}>Default</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant) => (
                  <tr key={variant.sku} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td className="py-2.5 font-mono text-xs" style={{ color: "var(--text-primary)" }}>{variant.sku}</td>
                    <td className="py-2.5" style={{ color: "var(--text-secondary)" }}>
                      {Object.entries(variant.attributes ?? {}).map(([k, v]) => `${k}: ${v}`).join(", ")}
                    </td>
                    <td className="py-2.5" style={{ color: "var(--text-primary)" }}>
                      ₹{variant.salePrice ?? variant.price}
                      {variant.salePrice && variant.salePrice < variant.price && (
                        <span className="ml-1.5 text-xs line-through" style={{ color: "var(--text-muted)" }}>₹{variant.price}</span>
                      )}
                    </td>
                    <td className="py-2.5" style={{ color: "var(--text-primary)" }}>{variant.stock}</td>
                    <td className="py-2.5">{variant.isDefault && <Check className="h-4 w-4" style={{ color: "var(--success)" }} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {product.approvalHistory?.length > 0 && (
        <Card title="Approval history">
          <div className="flex flex-col gap-3">
            {[...product.approvalHistory].reverse().map((entry, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "var(--color-primary)" }} />
                  {idx !== product.approvalHistory.length - 1 && <span className="w-px flex-1 mt-1" style={{ backgroundColor: "var(--border-light)" }} />}
                </div>
                <div className="pb-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${APPROVAL_STYLES[entry.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {entry.status}
                  </span>
                  {entry.reason && <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{entry.reason}</p>}
                  {entry.reviewedAt && (
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {format(new Date(entry.reviewedAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="Timeline">
        <DetailRow label="Created" value={format(new Date(product.createdAt), "MMM d, yyyy 'at' h:mm a")} />
        <DetailRow label="Last updated" value={format(new Date(product.updatedAt), "MMM d, yyyy 'at' h:mm a")} />
        {product.reviewedAt && <DetailRow label="Last reviewed" value={format(new Date(product.reviewedAt), "MMM d, yyyy 'at' h:mm a")} />}
      </Card>

      <Modal open={editOpen} title="Edit product" onClose={() => setEditOpen(false)} maxWidth="max-w-2xl">
        <ProductForm
          initialData={product}
          categories={categories}
          brands={brands}
          loading={updateProduct.isPending || updateProductMedia.isPending}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      <RejectProductModal
        open={rejectOpen}
        productTitle={product.title}
        loading={approveProduct.isPending}
        onConfirm={handleRejectConfirm}
        onClose={() => setRejectOpen(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete product"
        description={`Are you sure you want to delete "${product.title}"? It will be moved to trash and can be restored later.`}
        loading={deleteProduct.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />

      <ConfirmDialog
        open={permanentDeleteOpen}
        title="Permanently delete product"
        description={`This will permanently delete "${product.title}" and all its images. This cannot be undone.`}
        loading={deletePermanently.isPending}
        onConfirm={handlePermanentDeleteConfirm}
        onClose={() => setPermanentDeleteOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;