import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface TextareaProps<T extends FieldValues> { label: string; name: Path<T>; required?: boolean; register?: UseFormRegister<T>; }

const Textarea = <T extends FieldValues>({ label, name, required = false, register }: TextareaProps<T>) => (
    <div className="relative w-full mt-4">
        <textarea rows={3} name={name} placeholder=" " required={required} {...(register ? register(name) : {})} className="peer w-full resize-none border-b border-(--border-light) bg-transparent px-1 py-2 text-(--text-primary) outline-none transition-all duration-300 focus:border-(--color-primary)" />
        <label className="pointer-events-none absolute left-0 -top-3 text-xs text-(--text-muted) transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-xs peer-focus:text-(--color-primary)">{label}{required && <span className="ml-1 text-orange-500">*</span>}</label>
        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-(--color-primary) transition-all duration-300 peer-focus:w-full"></span>
    </div>
);

export default Textarea;