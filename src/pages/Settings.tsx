import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Input from "../components/common/Inputs/Input";
import Textarea from "../components/common/Inputs/Textarea";
import Checkbox from "../components/common/Inputs/Checkbox";
import Button from "../components/common/Button";
import Skeleton from "../components/common/skeletons/Skeleton";
import SkeletonFormBlock from "../components/common/skeletons/SkeletonFormBlock";
import { useGetSettings, useUpdateSettings, useUpdateSettingsMedia } from "../hooks/queries/setting.queries";
import { settingDetailsSchema, type SettingDetailsFormValues, type SettingDetailsFormOutput } from "../validator/setting.validator";

const Settings = () => {
  const { data, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const updateMedia = useUpdateSettingsMedia();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingDetailsFormValues>({
    resolver: zodResolver(settingDetailsSchema),
  });

  const setting = data?.data;

  useEffect(() => {
    if (!setting) return;
    reset({
      siteName: setting.siteName,
      tagline: setting.tagline ?? "",
      contactEmail: setting.contactEmail ?? "",
      contactPhone: setting.contactPhone ?? "",
      supportEmail: setting.supportEmail ?? "",
      addressLine1: setting.addressLine1 ?? "",
      city: setting.city ?? "",
      state: setting.state ?? "",
      country: setting.country ?? "",
      postalCode: setting.postalCode ?? "",
      currency: setting.currency,
      currencySymbol: setting.currencySymbol,
      taxPercentage: setting.taxPercentage,
      freeShippingThreshold: setting.freeShippingThreshold,
      defaultShippingCharge: setting.defaultShippingCharge,
      maintenanceMode: setting.maintenanceMode,
      maintenanceMessage: setting.maintenanceMessage ?? "",
      metaTitle: setting.metaTitle ?? "",
      metaDescription: setting.metaDescription ?? "",
      metaKeywords: setting.metaKeywords?.join(", ") ?? "",
      facebook: setting.socialLinks?.facebook ?? "",
      instagram: setting.socialLinks?.instagram ?? "",
      twitter: setting.socialLinks?.twitter ?? "",
      youtube: setting.socialLinks?.youtube ?? "",
      linkedin: setting.socialLinks?.linkedin ?? "",
    });
  }, [setting, reset]);

  const onSubmit = (values: SettingDetailsFormValues) => {
    const data = values as unknown as SettingDetailsFormOutput;
    const { facebook, instagram, twitter, youtube, linkedin, ...rest } = data;

    updateSettings.mutate(
      { ...rest, socialLinks: { facebook, instagram, twitter, youtube, linkedin } },
      { onSuccess: () => toast.success("Settings updated"), onError: (err) => toast.error(err.message) }
    );
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("logo", file);
    updateMedia.mutate(formData, { onError: (err) => toast.error(err.message) });
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("favicon", file);
    updateMedia.mutate(formData, { onError: (err) => toast.error(err.message) });
  };

  if (isLoading || !setting) {
    return (
      <div className="flex flex-col gap-6">
        <Heading2 title="Settings" subtitle="Manage store-wide configuration, branding, and policies" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card title="Branding">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-6 lg:col-span-2">
            {["General", "Contact information", "Commerce settings", "SEO"].map((title) => (
              <Card key={title} title={title}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => <SkeletonFormBlock key={i} />)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Heading2 title="Settings" subtitle="Manage store-wide configuration, branding, and policies" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Branding">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              {setting.logo?.URL ? (
                <img src={setting.logo.URL} alt="logo" className="h-16 w-16 rounded-lg object-cover border" style={{ borderColor: "var(--border-light)" }} />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border text-xs" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>No logo</div>
              )}
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Site logo</p>
                <button onClick={() => logoInputRef.current?.click()} className="text-xs cursor-pointer mt-1" style={{ color: "var(--color-primary)" }}>Change logo</button>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {setting.favicon?.URL ? (
                <img src={setting.favicon.URL} alt="favicon" className="h-16 w-16 rounded-lg object-cover border" style={{ borderColor: "var(--border-light)" }} />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border text-xs" style={{ borderColor: "var(--border-light)", color: "var(--text-muted)" }}>No favicon</div>
              )}
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Favicon</p>
                <button onClick={() => faviconInputRef.current?.click()} className="text-xs cursor-pointer mt-1" style={{ color: "var(--color-primary)" }}>Change favicon</button>
                <input ref={faviconInputRef} type="file" accept="image/*" className="hidden" onChange={handleFaviconChange} />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <Card title="General">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Site name" name="siteName" required register={register} />
                <Input label="Tagline" name="tagline" register={register} />
              </div>
              {errors.siteName && <p className="text-xs text-(--error)">{errors.siteName.message}</p>}
            </Card>

            <Card title="Contact information">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Contact email" name="contactEmail" register={register} />
                <Input label="Contact phone" name="contactPhone" register={register} />
                <Input label="Support email" name="supportEmail" register={register} />
              </div>
              {errors.contactEmail && <p className="text-xs text-(--error)">{errors.contactEmail.message}</p>}
              {errors.supportEmail && <p className="text-xs text-(--error)">{errors.supportEmail.message}</p>}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                <Input label="Address line" name="addressLine1" register={register} />
                <Input label="City" name="city" register={register} />
                <Input label="State" name="state" register={register} />
                <Input label="Country" name="country" register={register} />
                <Input label="Postal code" name="postalCode" register={register} />
              </div>
            </Card>

            <Card title="Commerce settings">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Currency code" name="currency" register={register} />
                <Input label="Currency symbol" name="currencySymbol" register={register} />
                <Input label="Tax percentage" name="taxPercentage" type="number" register={register} />
                <Input label="Free shipping threshold (₹)" name="freeShippingThreshold" type="number" register={register} />
                <Input label="Default shipping charge (₹)" name="defaultShippingCharge" type="number" register={register} />
              </div>
            </Card>

            <Card title="Maintenance mode">
              <Checkbox label="Enable maintenance mode" name="maintenanceMode" register={register} />
              <Textarea label="Maintenance message" name="maintenanceMessage" register={register} />
            </Card>

            <Card title="SEO">
              <Input label="Meta title" name="metaTitle" register={register} />
              <Textarea label="Meta description" name="metaDescription" register={register} />
              <Input label="Meta keywords (comma separated)" name="metaKeywords" register={register} />
            </Card>

            <Card title="Social links">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Facebook" name="facebook" register={register} />
                <Input label="Instagram" name="instagram" register={register} />
                <Input label="Twitter / X" name="twitter" register={register} />
                <Input label="YouTube" name="youtube" register={register} />
                <Input label="LinkedIn" name="linkedin" register={register} />
              </div>
              {errors.facebook && <p className="text-xs text-(--error)">{errors.facebook.message}</p>}
            </Card>

            <div className="flex justify-end">
              <Button value={updateSettings.isPending ? "Saving..." : "Save settings"} type="submit" disable={updateSettings.isPending} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;