export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectProps {
    label: string;
    name: string;
    value: string;
    options: SelectOption[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

const Select = ({ label, name, value, options, onChange, disabled = false, required = false, className = "", }: SelectProps) => {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={name} className="text-sm font-medium text-gray-700" >
                {label}
            </label>

            <select id={name} name={name} value={value} onChange={onChange} disabled={disabled} required={required} className={`w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed${className}`} >
                <option value="">Select {label}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value} >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;