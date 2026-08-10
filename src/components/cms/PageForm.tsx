import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../common/Inputs/Input";
import Textarea from "../common/Inputs/Textarea";
import Checkbox from "../common/Inputs/Checkbox";
import Button from "../common/Button";
import { PageType } from "../../enums/page.enum";
import type { PageIF } from "../../interface/data/page";

interface PageFormValues {
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  showInFooter?: boolean;
  showInHeader?: boolean;
  displayOrder?: string;
}

interface PageFormProps {
  initialData?: PageIF | null;
  loading?: boolean;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

const PageForm = ({ initialData, loading, onSubmit, onCancel }: PageFormProps) => {
  const { register, handleSubmit, reset } = useForm<PageFormValues>();

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        content: initialData.content,
        metaTitle: initialData.metaTitle ?? "",
        metaDescription: initialData.metaDescription ?? "",
        metaKeywords: initialData.metaKeywords?.join(", ") ?? "",
        showInFooter: initialData.showInFooter,
        showInHeader: initialData.showInHeader,
        displayOrder: String(initialData.displayOrder),
      });
    } else {
      reset({ title: "", content: "", metaTitle: "", metaDescription: "", metaKeywords: "", showInFooter: false, showInHeader: false, displayOrder: "0" });
    }
  }, [initialData, reset]);

  const pageTypeValue = initialData?.pageType ?? PageType.STATIC;

  const submitHandler = (values: PageFormValues, event?: React.BaseSyntheticEvent) => {
    const formEl = event?.target as HTMLFormElement | undefined;
    const pageTypeSelect = formEl?.querySelector<HTMLSelectElement>('select[name="pageType"]');

    onSubmit({
      title: values.title,
      content: values.content,
      pageType: pageTypeSelect?.value ?? pageTypeValue,
      metaTitle: values.metaTitle || undefined,
      metaDescription: values.metaDescription || undefined,
      metaKeywords: values.metaKeywords || undefined, // comma string — backend preprocesses it
      showInFooter: !!values.showInFooter,
      showInHeader: !!values.showInHeader,
      displayOrder: Number(values.displayOrder ?? 0),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      <Input label="Title" name="title" required register={register} />

      <div>
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Page type</label>
        <select name="pageType" defaultValue={pageTypeValue} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
          {Object.values(PageType).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <Textarea label="Content" name="content" required register={register} />

      <Input label="Meta title (optional)" name="metaTitle" register={register} />
      <Textarea label="Meta description (optional)" name="metaDescription" register={register} />
      <Input label="Meta keywords (comma separated, optional)" name="metaKeywords" register={register} />

      <div className="grid grid-cols-2 gap-4">
        <Checkbox label="Show in footer" name="showInFooter" register={register} />
        <Checkbox label="Show in header" name="showInHeader" register={register} />
      </div>
      <Input label="Display order" name="displayOrder" type="number" register={register} />

      <div className="flex justify-end gap-3 mt-2">
        <Button value="Cancel" variant="secondary" onClick={onCancel} />
        <Button value={loading ? "Saving..." : "Save page"} type="submit" disable={loading} />
      </div>
    </form>
  );
};

export default PageForm;