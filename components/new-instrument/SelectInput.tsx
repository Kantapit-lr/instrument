import { FormSelectProps } from "@/types/components";
import { BaseField, fieldClass } from "./BaseInput";

export function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "กรุณาเลือก",
  required = false,
}: FormSelectProps) {
  return (
    <BaseField label={label} htmlFor={name}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={fieldClass}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </BaseField>
  );
}
