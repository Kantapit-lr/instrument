"use client";

import { useEffect, useState } from "react";
import { Input } from "./Input";
import { Section } from "./Section";
import { DateInput } from "./DateInput";
import { SelectInput } from "./SelectInput";
import { CountryCombobox } from "./CountryCombobox";
import { ImageGallery } from "./ImageGallery";
import { emptyInstrumentForm, InstrumentFormData, SpecialCharacteristicInput } from "@/types/instrument";
import { SelectOption } from "@/types/instrument";
import { InstrumentFormProps } from "@/types/components";

const INSTRUMENT_TYPE_OPTIONS: SelectOption[] = [
  { value: "BALANCE", label: "เครื่องชั่ง (Balance)" },
  { value: "TEMPERATURE", label: "เครื่องวัดอุณหภูมิ (Temperature)" },
  { value: "PIPETTE", label: "เครื่องมือ (Pipette)" },
];

const INITIAL_CONDITION_OPTIONS: SelectOption[] = [
  { value: "ใหม่", label: "ใหม่" },
  { value: "ใช้แล้ว", label: "ใช้แล้ว" },
  { value: "ปรับสภาพใหม่", label: "ปรับสภาพใหม่" },
];

const FUNDING_TYPE_OPTIONS: SelectOption[] = [
  { value: "เงินบำรุง", label: "เงินบำรุง" },
  { value: "เงินงบประมาณ", label: "เงินงบประมาณ" },
  { value: "อื่นๆ", label: "อื่นๆ" },
];

export default function InstrumentForm({
  formId,
  mode = "create",
  initialData,
  onSubmitSuccess,
}: InstrumentFormProps) {
  const [form, setForm] = useState<InstrumentFormData>(initialData ?? emptyInstrumentForm);
  const [projectOptions, setProjectOptions] = useState<SelectOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [savedRegistrationNumber, setSavedRegistrationNumber] = useState<string | null>(
    mode === "edit" ? initialData?.registrationNumber ?? null : null
  );

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((json) => setProjectOptions(json.data ?? []))
      .catch(() => setErrorMessage("ไม่สามารถโหลดรายชื่อโครงการได้ ลองรีเฟรชหน้านี้อีกครั้ง"));
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ── SpecialCharacteristic helpers ──────────────────────────────
  function addSpecialChar() {
    setForm((prev) => ({
      ...prev,
      specialCharacteristics: [...prev.specialCharacteristics, { type: "", value: "", remark: "" }],
    }));
  }

  function removeSpecialChar(index: number) {
    setForm((prev) => ({
      ...prev,
      specialCharacteristics: prev.specialCharacteristics.filter((_, i) => i !== index),
    }));
  }

  function updateSpecialChar(index: number, field: keyof SpecialCharacteristicInput, value: string) {
    setForm((prev) => {
      const updated = [...prev.specialCharacteristics];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, specialCharacteristics: updated };
    });
  }

  // ── Submit ─────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mode === "create" && savedRegistrationNumber) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const url = mode === "edit"
        ? `/api/instruments/${initialData?.registrationNumber}`
        : "/api/instruments";
      const method = mode === "edit" ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        return;
      }

      if (mode === "create") setSavedRegistrationNumber(form.registrationNumber);
      onSubmitSuccess?.();
    } catch {
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  const isLocked = mode === "create" && savedRegistrationNumber !== null;

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-10">
      {errorMessage && (
        <div className="bg-danger-bg border border-danger-border text-danger-text text-sm px-4 py-3 rounded-xl">
          {errorMessage}
        </div>
      )}

      {isLocked && (
        <div className="bg-success-bg border border-success-border text-success-text text-sm px-4 py-3 rounded-xl">
          บันทึกข้อมูลพื้นฐานสำเร็จแล้ว สามารถเพิ่มรูปภาพได้ด้านล่าง
        </div>
      )}

      <fieldset disabled={isLocked} className="bg-card text-card-text p-8 rounded-2xl border border-border shadow-sm space-y-10 disabled:opacity-60">

        {/* ── ข้อมูลพื้นฐาน ─────────────────────────────────────── */}
        <Section title="ข้อมูลพื้นฐาน">
          <Input
            label="รหัสครุภัณฑ์ (Registration No.)"
            name="registrationNumber"
            value={form.registrationNumber}
            onChange={handleChange}
            required
            disabled={mode === "edit"}
          />
          <Input
            label="ชื่ออุปกรณ์"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <SelectInput
            label="ประเภท (Type)"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={INSTRUMENT_TYPE_OPTIONS}
            placeholder="เลือกประเภทอุปกรณ์"
            required
          />
          <Input label="ยี่ห้อ (Brand)" name="brand" value={form.brand} onChange={handleChange} />
          <Input label="รุ่น (Model)" name="model" value={form.model} onChange={handleChange} />
          <Input label="Serial No." name="serialNo" value={form.serialNo} onChange={handleChange} />
          <SelectInput
            label="โครงการ (Project)"
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            options={projectOptions}
            placeholder="เลือกโครงการ"
            required
          />
        </Section>

        {/* ── เทคนิคและแหล่งที่มา ───────────────────────────────── */}
        <Section title="เทคนิคและแหล่งที่มา">
          <Input label="ขนาด (Size)" name="size" value={form.size} onChange={handleChange} />
          <Input label="ผู้ผลิต (Manufacturer)" name="manufacturer" value={form.manufacturer} onChange={handleChange} />
          <Input label="ผู้จำหน่าย (Vendor)" name="vendor" value={form.vendor} onChange={handleChange} />
          <CountryCombobox
            label="ประเทศผู้ผลิต (Country)"
            name="country"
            value={form.country}
            onChange={(val) => setForm((prev) => ({ ...prev, country: val }))}
          />
          <Input
            label="ราคา (Price)"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
          />

          {/* แหล่งเงินทุน — ถ้าเลือก "อื่นๆ" จะโชว์ช่อง input ทางขวาในแถวเดียวกัน */}
          <SelectInput
            label="แหล่งเงินทุน (Funding Type)"
            name="fundingType"
            value={form.fundingType}
            onChange={handleChange}
            options={FUNDING_TYPE_OPTIONS}
            placeholder="เลือกแหล่งเงินทุน"
          />
          {form.fundingType === "อื่นๆ" && (
            <Input
              label="ระบุแหล่งเงินทุน (อื่นๆ)"
              name="fundingTypeRemark"
              value={form.fundingTypeRemark}
              onChange={handleChange}
              placeholder="ระบุแหล่งเงินทุนเพิ่มเติม..."
            />
          )}
        </Section>

        {/* ── สถานที่และการติดตั้ง ───────────────────────────────── */}
        <Section title="สถานที่และการติดตั้ง">
          <Input label="สถานที่ใช้งาน (Location)" name="location" value={form.location} onChange={handleChange} />
          <DateInput label="วันที่ได้รับ (Received Date)" name="receivedDate" value={form.receivedDate} onChange={handleChange} />
          <DateInput label="วันที่เริ่มใช้งาน (Active Date)" name="activeDate" value={form.activeDate} onChange={handleChange} />
          <SelectInput
            label="สภาพเมื่อแรกรับ (Initial Condition)"
            name="initialCondition"
            value={form.initialCondition}
            onChange={handleChange}
            options={INITIAL_CONDITION_OPTIONS}
            placeholder="เลือกสภาพเมื่อแรกรับ"
          />
        </Section>

        {/* ── อื่นๆ ─────────────────────────────────────────────── */}
        <Section title="อื่นๆ">
          <Input label="เลขที่เอกสารการเบิก (Withdrawal Document No.)" name="withdrawalDocumentNo" value={form.withdrawalDocumentNo} onChange={handleChange} />
          <Input label="ผู้บันทึก (Recorded By)" name="recordedBy" value={form.recordedBy} onChange={handleChange} />
          <div className="md:col-span-2 space-y-1.5">
            <label htmlFor="remark" className="block text-sm font-medium text-card-text">
              หมายเหตุ (Remark)
            </label>
            <textarea
              id="remark"
              name="remark"
              value={form.remark}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 bg-surface-muted text-surface-muted-text border border-border rounded-xl outline-none focus:ring-2 focus:ring-mahidol-blue/20"
            />
          </div>
        </Section>

        {/* ── คุณลักษณะเฉพาะ ────────────────────────────────────── */}
        <Section title="คุณลักษณะเฉพาะ">
          <div className="md:col-span-2 space-y-3">
            {form.specialCharacteristics.length === 0 && (
              <p className="text-sm text-text-muted">ยังไม่มีคุณลักษณะเฉพาะ กดปุ่มด้านล่างเพื่อเพิ่ม</p>
            )}

            {form.specialCharacteristics.map((sc, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-surface-muted rounded-xl border border-border">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-card-text">คุณลักษณะ</label>
                  <input
                    type="text"
                    value={sc.type}
                    onChange={(e) => updateSpecialChar(index, "type", e.target.value)}
                    placeholder="เช่น ความเร็วรอบ"
                    className="w-full px-4 py-2.5 bg-card text-card-text border border-border rounded-xl outline-none focus:ring-2 focus:ring-mahidol-blue/20 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-card-text">ค่า</label>
                  <input
                    type="text"
                    value={sc.value}
                    onChange={(e) => updateSpecialChar(index, "value", e.target.value)}
                    placeholder="เช่น 500 rpm"
                    className="w-full px-4 py-2.5 bg-card text-card-text border border-border rounded-xl outline-none focus:ring-2 focus:ring-mahidol-blue/20 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-card-text">หมายเหตุ</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sc.remark}
                      onChange={(e) => updateSpecialChar(index, "remark", e.target.value)}
                      placeholder="หมายเหตุ (ถ้ามี)"
                      className="flex-1 px-4 py-2.5 bg-card text-card-text border border-border rounded-xl outline-none focus:ring-2 focus:ring-mahidol-blue/20 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecialChar(index)}
                      className="px-3 py-2.5 text-danger-text bg-danger-bg border border-danger-border rounded-xl text-sm hover:opacity-80 transition-opacity"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSpecialChar}
              className="text-sm font-medium text-action-text hover:underline"
            >
              + เพิ่มคุณลักษณะเฉพาะ
            </button>
          </div>
        </Section>

      </fieldset>

      {/* ── รูปภาพอุปกรณ์ ─────────────────────────────────────────── */}
      <div className="bg-card text-card-text p-8 rounded-2xl border border-border shadow-sm">
        <Section title="รูปภาพอุปกรณ์">
          <div className="md:col-span-2">
            <ImageGallery registrationNumber={savedRegistrationNumber ?? ""} />
          </div>
        </Section>
      </div>

      <button type="submit" className="hidden" disabled={submitting || isLocked} />
    </form>
  );
}
