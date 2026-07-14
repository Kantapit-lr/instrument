"use client";

import { useEffect, useRef, useState } from "react";
import { FormInputProps } from "@/types/components";
import { BaseField, fieldClass } from "./BaseInput";
import DatePicker, { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("th", th);

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

// ช่วงปีให้เลือก: ย้อนหลัง 100 ปี ถึงล่วงหน้า 10 ปี (พอสำหรับกรอกวันที่ซื้อของเก่ามากๆ ได้)
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_RANGE = Array.from({ length: 111 }, (_, i) => CURRENT_YEAR + 10 - i);

// dropdown เล็กๆ ที่คุมสไตล์เองทั้งหมด (แทน native <select> ที่ browser ไปเรนเดอร์
// list ยาวๆ แบบคุมสไตล์ไม่ได้เลย โดยเฉพาะตอนตัวเลือกเยอะๆ อย่างปี)
function HeaderDropdown({
  value,
  options,
  onSelect,
}: {
  value: string;
  options: { value: number; label: string }[];
  onSelect: (value: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="text-sm font-medium bg-transparent border border-border rounded-md px-2 py-1 text-card-text hover:bg-surface-muted transition-colors"
      >
        {value}
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full left-0 mt-1 max-h-48 overflow-y-auto bg-card border border-border rounded-md shadow-md min-w-[90px]">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onSelect(opt.value);
                setIsOpen(false);
              }}
              className="w-full text-left text-sm px-3 py-1.5 text-card-text hover:bg-surface-muted transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DateInput({ label, name, value, onChange, required = false }: FormInputProps) {
  const selectedDate = value ? new Date(value) : null;

  return (
    <BaseField label={label} htmlFor={name}>
      <DatePicker
        id={name}
        selected={selectedDate}
        locale="th"
        dateFormat="dd/MM/yyyy"
        placeholderText="วว/ดด/ปปปป"
        className={fieldClass}
        wrapperClassName="w-full"
        required={required}
        onChange={(date: Date | null) => {
          onChange({
            target: { name, value: date ? date.toLocaleDateString("en-CA") : "" },
          } as React.ChangeEvent<HTMLInputElement>);
        }}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
        }: {
          date: Date;
          changeYear: (year: number) => void;
          changeMonth: (month: number) => void;
          decreaseMonth: () => void;
          increaseMonth: () => void;
        }) => (
          <div className="flex justify-between items-center gap-2 px-3 py-2">
            <button type="button" onClick={decreaseMonth} className="px-2 text-card-text">
              {"<"}
            </button>

            <div className="flex items-center gap-1.5">
              <HeaderDropdown
                value={THAI_MONTHS[date.getMonth()]}
                options={THAI_MONTHS.map((m, i) => ({ value: i, label: m }))}
                onSelect={changeMonth}
              />
              <HeaderDropdown
                value={String(date.getFullYear() + 543)}
                options={YEAR_RANGE.map((y) => ({ value: y, label: String(y + 543) }))}
                onSelect={changeYear}
              />
            </div>

            <button type="button" onClick={increaseMonth} className="px-2 text-card-text">
              {">"}
            </button>
          </div>
        )}
      />
    </BaseField>
  );
}
