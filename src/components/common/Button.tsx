import type { ButtonProps } from "../../interface/common";

export default function Button({ value, type = "button", disable = false, className = "", variant = "primary", Icon, options, onClick }: ButtonProps) {
    const variants = {
        primary: "bg-(--color-primary) text-white hover:bg-(--color-primary-dark) active:bg-(--color-primary-light) hover:shadow-(--shadow-primary)",
        outline: "border border-(--color-primary) hover:bg-(--color-primary-dark) active:bg-(--color-primary-light) hover:text-white hover:shadow-(--shadow-primary)",
        secondary: "bg-gray-200 text-black hover:bg-gray-300",
        danger: "bg-red-500 text-white hover:bg-red-600",
        success: "bg-green-500 text-white hover:bg-green-600",
        icon: "rounded border p-2",
        ghost: "bg-transparent text-(--color-primary) hover:bg-(--color-primary-light) active:bg-(--color-primary-dark) hover:text-white hover:shadow-(--shadow-primary)"
    };

    return (
        <button type={type} disabled={disable} className={`px-3.5 py-1 rounded-md transition-(--transition) cursor-pointer ${variants[variant]} ${className}`} onClick={onClick}> {Icon && <Icon {...options} />} {value}</button>
    );
}