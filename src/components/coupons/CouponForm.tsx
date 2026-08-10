import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema, type CouponFormValues, type CouponFormOutput } from "../../validator/coupon.validator";
import Input from "../common/Inputs/Input";
import Textarea from "../common/Inputs/Textarea";
import Button from "../common/Button";
import { DiscountType } from "../../enums/coupon.enum";
import type { CouponIF } from "../../interface/data/coupon";

interface CouponFormProps {
  initialData?: CouponIF | null;
  loading?: boolean;
  onSubmit: (data: CouponFormOutput) => void;
  onCancel: () => void;
}

const toDateInputValue = (date?: Date | string) => (date ? new Date(date).toISOString().slice(0, 10) : "");

const CouponForm = ({ initialData, loading, onSubmit, onCancel }: CouponFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        description: initialData.description ?? "",
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        maxDiscountAmount: initialData.maxDiscountAmount ?? undefined,
        minOrderAmount: initialData.minOrderAmount,
        usageLimit: initialData.usageLimit ?? undefined,
        usageLimitPerUser: initialData.usageLimitPerUser,
        validFrom: toDateInputValue(initialData.validFrom),
        validUntil: toDateInputValue(initialData.validUntil),
      });
    } else {
      reset({ code: "", description: "", discountType: DiscountType.PERCENTAGE, minOrderAmount: 0, usageLimitPerUser: 1, validFrom: "", validUntil: "" });
    }
  }, [initialData, reset]);

  const submitHandler = (values: CouponFormValues) => {
    onSubmit(values as unknown as CouponFormOutput);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      <Input label="Coupon code" name="code" required register={register} />
      {errors.code && <p className="text-xs text-(--error)">{errors.code.message}</p>}

      <Textarea label="Description (optional)" name="description" register={register} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Discount type *</label>
          <select {...register("discountType")} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
            <option value={DiscountType.PERCENTAGE}>Percentage</option>
            <option value={DiscountType.FLAT}>Flat amount</option>
          </select>
        </div>
        <Input label="Discount value" name="discountValue" type="number" required register={register} />
      </div>
      {errors.discountValue && <p className="text-xs text-(--error)">{errors.discountValue.message}</p>}

      <div className="grid grid-cols-2 gap-4">
        <Input label="Max discount (₹, optional)" name="maxDiscountAmount" type="number" register={register} />
        <Input label="Min order amount (₹)" name="minOrderAmount" type="number" register={register} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Total usage limit (optional)" name="usageLimit" type="number" register={register} />
        <Input label="Usage limit per user" name="usageLimitPerUser" type="number" register={register} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Valid from" name="validFrom" type="date" required register={register} />
        <Input label="Valid until" name="validUntil" type="date" required register={register} />
      </div>
      {errors.validFrom && <p className="text-xs text-(--error)">{errors.validFrom.message}</p>}
      {errors.validUntil && <p className="text-xs text-(--error)">{errors.validUntil.message}</p>}

      <div className="flex justify-end gap-3 mt-2">
        <Button value="Cancel" variant="secondary" onClick={onCancel} />
        <Button value={loading ? "Saving..." : "Save coupon"} type="submit" disable={loading} />
      </div>
    </form>
  );
};

export default CouponForm;