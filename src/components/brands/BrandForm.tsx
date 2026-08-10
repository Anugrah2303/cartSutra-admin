import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandSchema, type BrandFormValues, type BrandFormOutput } from "../../validator/brand.validator";
import Input from "../common/Inputs/Input";
import Textarea from "../common/Inputs/Textarea";
import ImageInput from "../common/Inputs/ImageInput";
import Checkbox from "../common/Inputs/Checkbox";
import Button from "../common/Button";
import type BrandIF from "../../interface/data/brand";

interface BrandFormProps {
  initialData?: BrandIF | null;
  loading?: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

const BrandForm = ({ initialData, loading, onSubmit, onCancel }: BrandFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description ?? "",
        website: initialData.website ?? "",
        isFeatured: initialData.isFeatured,
      });
    } else {
      reset({ name: "", description: "", website: "", isFeatured: false });
    }
  }, [initialData, reset]);

  const submitHandler = (values: BrandFormValues, event?: React.BaseSyntheticEvent) => {
    const data = values as unknown as BrandFormOutput;

    const formEl = event?.target as HTMLFormElement | undefined;
    const avatarInput = formEl?.querySelector<HTMLInputElement>('input[name="avatar"]');
    const avatarFile = avatarInput?.files?.[0] ?? null;

    if (!initialData && !avatarFile) {
      alert("Please upload a brand logo");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.website) formData.append("website", data.website);
    formData.append("isFeatured", String(data.isFeatured));
    if (avatarFile) formData.append("avatar", avatarFile);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      <Input label="Brand name" name="name" required register={register} />
      {errors.name && <p className="text-xs text-(--error)">{errors.name.message}</p>}

      <Textarea label="Description" name="description" register={register} />

      <Input label="Website (optional)" name="website" register={register} />
      {errors.website && <p className="text-xs text-(--error)">{errors.website.message}</p>}

      <ImageInput label="Brand logo" name="avatar" oldImg={initialData?.avatar.URL} />

      <Checkbox label="Feature this brand on the homepage" name="isFeatured" register={register} />

      <div className="flex justify-end gap-3 mt-2">
        <Button value="Cancel" variant="secondary" onClick={onCancel} />
        <Button value={loading ? "Saving..." : "Save brand"} type="submit" disable={loading} />
      </div>
    </form>
  );
};

export default BrandForm;