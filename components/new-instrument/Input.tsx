import { FormInputProps } from "@/types/components";
import { BaseField, fieldClass } from "./BaseInput";

export function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  min,
  max,
  step,
  required = false,
  disabled = false,
}: FormInputProps) {
  return (
    <BaseField label={label} htmlFor={name}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
        disabled={disabled}
        className={`${fieldClass} disabled:opacity-60 disabled:cursor-not-allowed`}
      />
    </BaseField>
  );
}
