import { useState } from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";


export interface inputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  required?: boolean;
  register?: UseFormRegister<T>;
}

const PasswordInput = <T extends FieldValues>({ label, name, register }: inputProps<T>) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <div className="w-full relative mt-4">
      
      <input {...(register ? register(name) : {})} type={show ? "text" : "password"} placeholder=" " required name={name} onFocus={() => setFocused(true)} onBlur={(e) => setFocused(!!e.target.value)} className="peer w-full px-1 py-2 pr-8 bg-transparent text-(--text-primary) border-b border-(--border-light) outline-none transition-all duration-300 focus:border-(--color-primary)" autoComplete="current-password" />

      <label className={`absolute left-0 text-(--text-muted) text-10 pointer-events-none transition-all duration-300 ${focused ? "-top-3 text-xs text-(--color-primary)" : "top-2"} peer-focus:-top-3 peer-focus:text-xs peer-focus:text-(--color-primary)`}>
        {label}
        <span className="text-orange-500 ml-1">*</span>
      </label>

      <button type="button" onClick={() => setShow(!show)} className="absolute right-0 top-2 text-(--text-muted) text-xs cursor-pointer">
        {show ? "Hide" : "Show"}
      </button>
      <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-(--color-primary) transition-all duration-300 peer-focus:w-full"></span>
    </div>
  );
};

export default PasswordInput;