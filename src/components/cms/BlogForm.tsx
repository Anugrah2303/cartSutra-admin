import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../common/Inputs/Input";
import Textarea from "../common/Inputs/Textarea";
import ImageInput from "../common/Inputs/ImageInput";
import Button from "../common/Button";
import type { BlogIF } from "../../interface/data/blog";

interface BlogFormValues {
  title: string;
  shortDescription?: string;
  content: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string;
}

interface BlogFormProps {
  initialData?: BlogIF | null;
  loading?: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

const BlogForm = ({ initialData, loading, onSubmit, onCancel }: BlogFormProps) => {
  const { register, handleSubmit, reset } = useForm<BlogFormValues>();

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        shortDescription: initialData.shortDescription ?? "",
        content: initialData.content,
        category: initialData.category ?? "",
        metaTitle: initialData.metaTitle ?? "",
        metaDescription: initialData.metaDescription ?? "",
        tags: initialData.tags?.join(", ") ?? "",
      });
    } else {
      reset({ title: "", shortDescription: "", content: "", category: "", metaTitle: "", metaDescription: "", tags: "" });
    }
  }, [initialData, reset]);

  const submitHandler = (values: BlogFormValues, event?: React.BaseSyntheticEvent) => {
    const formEl = event?.target as HTMLFormElement | undefined;
    const coverImageFile = formEl?.querySelector<HTMLInputElement>('input[name="coverImage"]')?.files?.[0] ?? null;

    if (!initialData && !coverImageFile) {
      alert("Please upload a cover image");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    if (values.shortDescription) formData.append("shortDescription", values.shortDescription);
    formData.append("content", values.content);
    if (values.category) formData.append("category", values.category);
    if (values.metaTitle) formData.append("metaTitle", values.metaTitle);
    if (values.metaDescription) formData.append("metaDescription", values.metaDescription);
    if (values.tags) formData.append("tags", values.tags); // comma string — backend preprocesses it
    if (coverImageFile) formData.append("coverImage", coverImageFile);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      <Input label="Title" name="title" required register={register} />
      <Textarea label="Short description (optional)" name="shortDescription" register={register} />
      <Textarea label="Content" name="content" required register={register} />
      <Input label="Category (optional)" name="category" register={register} />
      <Input label="Tags (comma separated, optional)" name="tags" register={register} />
      <Input label="Meta title (optional)" name="metaTitle" register={register} />
      <Textarea label="Meta description (optional)" name="metaDescription" register={register} />

      <ImageInput label={initialData ? "Replace cover image (optional)" : "Cover image"} name="coverImage" oldImg={initialData?.coverImage.URL} />

      <div className="flex justify-end gap-3 mt-2">
        <Button value="Cancel" variant="secondary" onClick={onCancel} />
        <Button value={loading ? "Saving..." : "Save blog"} type="submit" disable={loading} />
      </div>
    </form>
  );
};

export default BlogForm;