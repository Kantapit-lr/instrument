"use client";

import { useEffect, useRef, useState } from "react";
import { fieldClass, labelClass } from "./BaseInput";

// รายชื่อประเทศที่ใช้บ่อยในงาน calibration/เครื่องมือวิทยาศาสตร์
// เรียงตามความถี่การใช้งานในบริบทของไทย (ไทยก่อน ตามด้วยประเทศผู้ผลิตเครื่องมือหลัก)
const COUNTRIES = [
  "ไทย",
  "ญี่ปุ่น",
  "เยอรมนี",
  "สหรัฐอเมริกา",
  "จีน",
  "สวิตเซอร์แลนด์",
  "สวีเดน",
  "เนเธอร์แลนด์",
  "สหราชอาณาจักร",
  "ฝรั่งเศส",
  "เกาหลีใต้",
  "อิตาลี",
  "ออสเตรีย",
  "เดนมาร์ก",
  "ฟินแลนด์",
  "แคนาดา",
  "ออสเตรเลีย",
  "สิงคโปร์",
  "ไต้หวัน",
  "อินเดีย",
];

interface CountryComboboxProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export function CountryCombobox({ label, name, value, onChange }: CountryComboboxProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ซิงค์ค่า input กับ value จากภายนอก (กรณีโหมด edit โหลดค่าเดิมมาเติม)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // ปิด dropdown เมื่อคลิกที่อื่นนอกกล่อง
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = inputValue.trim()
    ? COUNTRIES.filter((c) => c.includes(inputValue.trim()))
    : COUNTRIES;

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    onChange(e.target.value); // ส่งค่าที่พิมพ์ขึ้นไปด้วย เผื่อเป็นประเทศที่ไม่อยู่ใน list
    setIsOpen(true);
  }

  function handleSelect(country: string) {
    setInputValue(country);
    onChange(country);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="space-y-1.5 relative">
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        autoComplete="off"
        placeholder="พิมพ์หรือเลือกประเทศ..."
        className={fieldClass}
      />
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-md overflow-y-auto max-h-48 z-20">
          {filtered.length > 0 ? (
            filtered.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => handleSelect(country)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-surface-muted ${
                  country === inputValue ? "text-action-text font-medium" : "text-card-text"
                }`}
              >
                {country}
              </button>
            ))
          ) : (
            <p className="px-4 py-2 text-sm text-text-muted">
              ไม่พบประเทศที่ตรงกัน (จะใช้ค่าที่พิมพ์แทน)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
