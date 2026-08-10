import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputProps<T extends FieldValues> { label: string; name: Path<T>; type?: React.HTMLInputTypeAttribute; required?: boolean; register?: UseFormRegister<T>; }

const Input = <T extends FieldValues>({ label, type = "text", name, required = false, register }: InputProps<T>) => (
    <div className="relative w-full mt-4">
        <input type={type} {...(register ? register(name) : {})} name={name} placeholder=" " required={required} className="peer w-full px-1 py-2 bg-transparent text-(--text-primary) border-b border-(--border-light) outline-none transition-all duration-300 focus:border-(--color-primary)" />
        <label className="absolute left-0 -top-3 text-xs text-(--text-muted) pointer-events-none transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-xs peer-focus:text-(--color-primary)">{label}{required && <span className="ml-1 text-orange-500">*</span>}</label>
        <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-(--color-primary) transition-all duration-300 peer-focus:w-full"></span>
    </div>
);

export default Input;