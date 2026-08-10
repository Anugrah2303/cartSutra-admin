import type { FieldValues, UseFormRegister, Path } from "react-hook-form";

interface CheckboxProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register?: UseFormRegister<T>;
}

const Checkbox = <T extends FieldValues>({ label, name, register }: CheckboxProps<T>) => (
  <label className="flex items-center gap-2 cursor-pointer mt-2">
    <input
      type="checkbox"
      {...(register ? register(name) : {})}
      className="h-4 w-4 rounded accent-(--color-primary) cursor-pointer"
    />
    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
  </label>
);

export default Checkbox;