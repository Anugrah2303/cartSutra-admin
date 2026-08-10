import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormValues, type CategoryFormOutput } from "../../validator/category.validator";
import Input from "../common/Inputs/Input";
import Textarea from "../common/Inputs/Textarea";
import ImageInput from "../common/Inputs/ImageInput";
import Checkbox from "../common/Inputs/Checkbox";
import Button from "../common/Button";
import type { categoryIF } from "../../interface/data/category";
import { CategoryLevel } from "../../enums/category.enum";

interface CategoryFormProps {
  initialData?: categoryIF | null;
  categories: categoryIF[];
  loading?: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

const CategoryForm = ({ initialData, categories, loading, onSubmit, onCancel }: CategoryFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description ?? "",
        parent: initialData.parent ?? "",
        isActive: initialData.isActive,
      });
    } else {
      reset({ name: "", description: "", parent: "", isActive: true });
    }
  }, [initialData, reset]);

  const parentOptions = useMemo(
    () => categories.filter((c) => c.level !== CategoryLevel.GRANDCHILD && c._id !== initialData?._id),
    [categories, initialData]
  );

  const submitHandler = (values: CategoryFormValues, event?: React.BaseSyntheticEvent) => {
    const data = values as unknown as CategoryFormOutput;

    const formEl = event?.target as HTMLFormElement | undefined;
    const avatarInput = formEl?.querySelector<HTMLInputElement>('input[name="avatar"]');
    const avatarFile = avatarInput?.files?.[0] ?? null;

    const parentCategory = categories.find((c) => c._id === data.parent);
    let level: CategoryLevel = CategoryLevel.ROOT;
    if (parentCategory?.level === CategoryLevel.ROOT) level = CategoryLevel.CHILD;
    if (parentCategory?.level === CategoryLevel.CHILD) level = CategoryLevel.GRANDCHILD;

    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.parent) formData.append("parent", data.parent);
    formData.append("level", level);
    formData.append("isActive", String(data.isActive));
    if (avatarFile) formData.append("avatar", avatarFile);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      <Input label="Category name" name="name" required register={register} />
      {errors.name && <p className="text-xs text-(--error)">{errors.name.message}</p>}

      <Textarea label="Description" name="description" register={register} />

      <div>
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Parent category</label>
        <select {...register("parent")} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
          <option value="">None (top-level category)</option>
          {parentOptions.map((c) => (
            <option key={c._id} value={c._id}>
              {c.level === CategoryLevel.CHILD ? "— " : ""}{c.name}
            </option>
          ))}
        </select>
      </div>

      <ImageInput label="Category image" name="avatar" />

      <Checkbox label="Active (visible to customers)" name="isActive" register={register} />

      <div className="flex justify-end gap-3 mt-2">
        <Button value="Cancel" variant="secondary" onClick={onCancel} />
        <Button value={loading ? "Saving..." : "Save category"} type="submit" disable={loading} />
      </div>
    </form>
  );
};

export default CategoryForm;