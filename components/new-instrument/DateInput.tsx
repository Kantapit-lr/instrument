import { FormInputProps } from "@/types/components";
import { BaseField, fieldClass } from "./BaseInput";

export function DateInput({
  label,
  name,
  value,
  onChange,
  min,
  max,
  required = false,
}: FormInputProps) {
  return (
    <BaseField label={label} htmlFor={name}>
      <input
        id={name}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        required={required}
        className={`${fieldClass} cursor-pointer scheme-light`}
       />
    </BaseField>
  );
}
