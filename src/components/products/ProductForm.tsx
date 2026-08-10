import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues, type ProductFormOutput } from "../../validator/product.validator";
import Input from "../common/Inputs/Input";
import Textarea from "../common/Inputs/Textarea";
import ImageInput from "../common/Inputs/ImageInput";
import Button from "../common/Button";
import type { ProductIF } from "../../interface/data/product";
import type { categoryIF } from "../../interface/data/category";
import type BrandIF from "../../interface/data/brand";

export interface ProductSubmitPayload {
  data: ProductFormOutput;
  thumbnailFile: File | null;
  productImageFiles: File[];
}

interface ProductFormProps {
  initialData?: ProductIF | null;
  categories: categoryIF[];
  brands: BrandIF[];
  loading?: boolean;
  onSubmit: (payload: ProductSubmitPayload) => void;
  onCancel: () => void;
}

const ProductForm = ({ initialData, categories, brands, loading, onSubmit, onCancel }: ProductFormProps) => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        shortDescription: initialData.shortDescription ?? "",
        category: initialData.category,
        brand: initialData.brand ?? "",
        price: initialData.price,
        discount: initialData.discount,
        stock: initialData.stock,
        lowStockAlert: initialData.lowStockAlert,
        tags: initialData.tags?.join(", ") ?? "",
        costPrice: initialData.costPrice,
      });
    } else {
      reset({ title: "", description: "", shortDescription: "", category: "", brand: "", tags: "", costPrice: "" });
    }
  }, [initialData, reset]);

  const submitHandler = (values: ProductFormValues, event?: React.BaseSyntheticEvent) => {
    const data = values as unknown as ProductFormOutput;

    const formEl = event?.target as HTMLFormElement | undefined;

    const thumbnailInput = formEl?.querySelector<HTMLInputElement>('input[name="thumbnailImage"]');
    const thumbnailFile = thumbnailInput?.files?.[0] ?? null;

    const productImagesInput = formEl?.querySelector<HTMLInputElement>('input[name="productImage"]');
    const productImageFiles = productImagesInput?.files ? Array.from(productImagesInput.files) : [];

    if (!initialData && !thumbnailFile) {
      alert("Please upload a thumbnail image");
      return;
    }
    console.log(data)
    onSubmit({ data, thumbnailFile, productImageFiles });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      <Input label="Product title" name="title" required register={register} />
      {errors.title && <p className="text-xs text-(--error)">{errors.title.message}</p>}

      <Textarea label="Short description" name="shortDescription" register={register} />

      <Textarea label="Full description" name="description" required register={register} />
      {errors.description && <p className="text-xs text-(--error)">{errors.description.message}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Category *</label>
          <select {...register("category")} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          {errors.category && <p className="text-xs text-(--error)">{errors.category.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Brand</label>
          <select {...register("brand")} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
            <option value="">Select brand</option>
            {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input label="Price (₹)" name="price" type="number" required register={register} />
        <Input label="Discount (%)" name="discount" type="number" register={register} />
        <Input label="Stock" name="stock" type="number" required register={register} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Low stock alert" name="lowStockAlert" type="number" register={register} />
        <Input label="cost price" name="costPrice" type="number" register={register} />
      </div>

      <div>
        <Input label="Tags (comma separated)" name="tags" register={register} />
      </div>

      <ImageInput label={initialData ? "Replace thumbnail (optional)" : "Thumbnail image"} name="thumbnailImage" oldImg={initialData?.thumbnailImage?.URL} />

      <ImageInput
        label={initialData ? "Replace gallery images (optional, up to 4)" : "Gallery images (optional, up to 4)"}
        name="productImage"
        multiple
        oldImgs={initialData?.productImages?.map((img) => img.URL)}
      />

      <div className="flex justify-end gap-3 mt-2">
        <Button value="Cancel" variant="secondary" onClick={onCancel} />
        <Button value={loading ? "Saving..." : "Save product"} type="submit" disable={loading} />
      </div>
    </form>
  );
};

export default ProductForm;