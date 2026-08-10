import { useRef, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useUpdateProductMedia, useDeleteProductImage } from "../../hooks/queries/product.queries";
import type { ProductIF } from "../../interface/data/product";

interface ProductGalleryEditorProps {
  product: ProductIF;
}

const ProductGalleryEditor = ({ product }: ProductGalleryEditorProps) => {
  const updateMedia = useUpdateProductMedia();
  const deleteImage = useDeleteProductImage();

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingPublicId, setReplacingPublicId] = useState<string | null>(null);

  const busy = updateMedia.isPending || deleteImage.isPending;

  const handleThumbnailReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.append("thumbnailImage", file);
    updateMedia.mutate({ slug: product.slug, data: formData }, {
      onSuccess: () => toast.success("Thumbnail updated"),
    });
  };

  const startReplace = (publicId: string) => {
    setReplacingPublicId(publicId);
    requestAnimationFrame(() => replaceInputRef.current?.click());
  };

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !replacingPublicId) return;

    const formData = new FormData();
    formData.append("productImage", file);
    formData.append("publicId", replacingPublicId);
    updateMedia.mutate({ slug: product.slug, data: formData }, {
      onSuccess: () => toast.success("Image replaced"),
      onSettled: () => setReplacingPublicId(null),
    });
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.append("productImage", file);
    formData.append("action", "append");
    updateMedia.mutate({ slug: product.slug, data: formData }, {
      onSuccess: () => toast.success("Image added"),
    });
  };

  const handleDelete = (publicId: string) => {
    if ((product.productImages?.length ?? 0) <= 1) {
      toast.error("Product must have at least one gallery image");
      return;
    }
    deleteImage.mutate({ slug: product.slug, publicId }, {
      onSuccess: () => toast.success("Image removed"),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Thumbnail */}
      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>THUMBNAIL</p>
        <div className="group relative h-28 w-28 overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-light)" }}>
          <img src={product.thumbnailImage?.URL} alt={product.title} className="h-full w-full object-cover" />
          <button
            onClick={() => thumbnailInputRef.current?.click()}
            disabled={busy}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 cursor-pointer disabled:cursor-wait"
          >
            <Pencil className="h-5 w-5 text-white" />
          </button>
          <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailReplace} />
        </div>
      </div>

      {/* Gallery */}
      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
          GALLERY ({product.productImages?.length ?? 0}/4)
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {product.productImages?.map((img) => (
            <div key={img.PUBLIC_ID} className="group relative h-24 overflow-hidden rounded-lg border" style={{ borderColor: "var(--border-light)" }}>
              <img src={img.URL} alt="gallery" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button onClick={() => startReplace(img.PUBLIC_ID)} disabled={busy} className="rounded-md p-1.5 cursor-pointer hover:bg-white/20 disabled:cursor-wait" title="Replace image">
                  <Pencil className="h-4 w-4 text-white" />
                </button>
                <button onClick={() => handleDelete(img.PUBLIC_ID)} disabled={busy} className="rounded-md p-1.5 cursor-pointer hover:bg-white/20 disabled:cursor-wait" title="Delete image">
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          ))}

          {(product.productImages?.length ?? 0) < 4 && (
            <button
              onClick={() => addInputRef.current?.click()}
              disabled={busy}
              className="flex h-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed cursor-pointer hover:bg-(--bg-soft) disabled:cursor-wait"
              style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}
            >
              <Plus className="h-5 w-5" />
              <span className="text-[11px]">Add image</span>
            </button>
          )}
        </div>

        <input ref={addInputRef} type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
        <input ref={replaceInputRef} type="file" accept="image/*" className="hidden" onChange={handleReplaceFile} />
      </div>
    </div>
  );
};

export default ProductGalleryEditor;