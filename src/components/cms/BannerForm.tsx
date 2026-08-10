import { useEffect } from "react";
import Input from "../common/Inputs/Input";
import Textarea from "../common/Inputs/Textarea";
import ImageInput from "../common/Inputs/ImageInput";
import Button from "../common/Button";
import { useForm, useWatch } from "react-hook-form";
import { BannerPosition, BannerLinkType } from "../../enums/banner.enum";
import type { BannerIF } from "../../interface/data/banner";

interface BannerFormValues {
  title: string;
  subtitle?: string;
  position: BannerPosition;
  displayOrder?: string;
  linkType: BannerLinkType;
  linkValue?: string;
  startDate?: string;
  endDate?: string;
}

interface BannerFormProps {
  initialData?: BannerIF | null;
  loading?: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

const BannerForm = ({ initialData, loading, onSubmit, onCancel }: BannerFormProps) => {
  const { register, handleSubmit, reset, control } = useForm<BannerFormValues>({
    defaultValues: {
      title: "",
      subtitle: "",
      position: BannerPosition.HOME_HERO,
      displayOrder: "0",
      linkType: BannerLinkType.NONE,
      linkValue: "",
      startDate: "",
      endDate: "",
    },
  });

  // useWatch (not the watch() function off useForm) — this is the React-Compiler-safe
  // way to subscribe to a single field's live value, since it's a proper hook that
  // re-renders this component through React's normal subscription model rather than
  // an imperative callback the compiler can't reason about.
  const linkType = useWatch({ control, name: "linkType" });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        subtitle: initialData.subtitle ?? "",
        position: initialData.position,
        displayOrder: String(initialData.displayOrder),
        linkType: initialData.linkType,
        linkValue: initialData.linkValue ?? "",
        startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : "",
        endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
      });
    } else {
      reset({
        title: "",
        subtitle: "",
        position: BannerPosition.HOME_HERO,
        displayOrder: "0",
        linkType: BannerLinkType.NONE,
        linkValue: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [initialData, reset]);

  const submitHandler = (values: BannerFormValues, event?: React.BaseSyntheticEvent) => {
    const formEl = event?.target as HTMLFormElement | undefined;
    const imageFile = formEl?.querySelector<HTMLInputElement>('input[name="image"]')?.files?.[0] ?? null;
    const mobileImageFile = formEl?.querySelector<HTMLInputElement>('input[name="mobileImage"]')?.files?.[0] ?? null;

    if (!initialData && !imageFile) {
      alert("Please upload a banner image");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    if (values.subtitle) formData.append("subtitle", values.subtitle);
    formData.append("position", values.position);
    formData.append("displayOrder", values.displayOrder ?? "0");
    formData.append("linkType", values.linkType);
    if (values.linkType !== BannerLinkType.NONE && values.linkValue) formData.append("linkValue", values.linkValue);
    if (values.startDate) formData.append("startDate", values.startDate);
    if (values.endDate) formData.append("endDate", values.endDate);
    if (imageFile) formData.append("image", imageFile);
    if (mobileImageFile) formData.append("mobileImage", mobileImageFile);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      <Input label="Title" name="title" required register={register} />
      <Textarea label="Subtitle (optional)" name="subtitle" register={register} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Position</label>
          <select {...register("position")} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
            {Object.values(BannerPosition).map((p) => <option key={p} value={p}>{p.replace(/_/g, " ")}</option>)}
          </select>
        </div>
        <Input label="Display order" name="displayOrder" type="number" register={register} />
      </div>

      <div>
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Link type</label>
        <select {...register("linkType")} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
          {Object.values(BannerLinkType).map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {linkType !== BannerLinkType.NONE && (
        <Input
          label={linkType === BannerLinkType.EXTERNAL ? "External URL (https://...)" : `${linkType} slug`}
          name="linkValue"
          register={register}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input label="Start date (optional)" name="startDate" type="date" register={register} />
        <Input label="End date (optional)" name="endDate" type="date" register={register} />
      </div>

      <ImageInput label={initialData ? "Replace image (optional)" : "Banner image"} name="image" oldImg={initialData?.image.URL} />
      <ImageInput label="Mobile image (optional)" name="mobileImage" oldImg={initialData?.mobileImage?.URL} />

      <div className="flex justify-end gap-3 mt-2">
        <Button value="Cancel" variant="secondary" onClick={onCancel} />
        <Button value={loading ? "Saving..." : "Save banner"} type="submit" disable={loading} />
      </div>
    </form>
  );
};

export default BannerForm;