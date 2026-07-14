"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/new-instrument/Input";
import { SelectInput } from "@/components/new-instrument/SelectInput";
import { DateInput } from "@/components/new-instrument/DateInput";
import { Section } from "@/components/new-instrument/Section";
import { ResultRowsEditor } from "./ResultRowsEditor";
import {
  emptyCalibrationForm,
  emptyResultBalance,
  emptyResultTemperature,
  emptyResultPipette,
  CalibrationFormData,
  RESULT_STATUS_OPTIONS,
} from "@/types/calibration";
import { OpenScheduleOption } from "@/types/calibration";
import { SelectOption } from "@/types/instrument";
import { CalibrationFormProps, ResultRowField } from "@/types/components";

const SUMMARY_RESULT_OPTIONS: SelectOption[] = RESULT_STATUS_OPTIONS;

const BALANCE_FIELDS: ResultRowField[] = [
  { name: "appliedWeight", label: "น้ำหนักมาตรฐาน", type: "number" },
  { name: "balanceReading", label: "ค่าที่อ่านได้จากเครื่องชั่ง", type: "number" },
  { name: "unit", label: "หน่วย" },
  { name: "correction", label: "ค่าแก้", type: "number" },
  { name: "mu", label: "ค่าความไม่แน่นอน (MU)", type: "number" },
  { name: "totalErrorMinus", label: "ค่าความผิดพลาดลบ", type: "number" },
  { name: "totalErrorPlus", label: "ค่าความผิดพลาดบวก", type: "number" },
];

const TEMPERATURE_FIELDS: ResultRowField[] = [
  { name: "position", label: "ตำแหน่งจุดวัด" },
  { name: "standardReading", label: "ค่าอ่านได้มาตรฐาน", type: "number" },
  { name: "unit", label: "หน่วย" },
  { name: "mu", label: "ค่าความไม่แน่นอน (MU)", type: "number" },
  { name: "averageStandardReadingMc", label: "ค่าเฉลี่ยมาตรฐานที่อ่านได้", type: "number" },
];

const PIPETTE_FIELDS: ResultRowField[] = [
  { name: "parameter", label: "พารามิเตอร์การตรวจสอบ" },
  { name: "pointOfCalibration", label: "จุดสอบเทียบ" },
  { name: "unit", label: "หน่วย" },
  { name: "mpePercent", label: "ค่า MPE (%)", type: "number" },
  { name: "error", label: "ค่าความผิดพลาด", type: "number" },
  { name: "ms", label: "ค่าความไม่แน่นอน (MS)", type: "number" },
  { name: "totalError", label: "ค่าความผิดพลาดรวม", type: "number" },
];

export function CalibrationForm({
  formId,
  mode = "create",
  calibrationId,
  initialData,
  initialSchedule,
  onSubmitSuccess,
}: CalibrationFormProps) {
  const [form, setForm] = useState<CalibrationFormData>(initialData ?? emptyCalibrationForm);
  const [scheduleOptions, setScheduleOptions] = useState<SelectOption[]>([]);
  const [scheduleDetails, setScheduleDetails] = useState<Record<string, OpenScheduleOption>>({});
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // โหลดรอบกำหนดการที่ยังไม่มีผลสอบเทียบ + รอบเดิมของใบนี้ (ถ้าเป็นโหมดแก้ไข ต้องโชว์ตัวเลือกเดิมด้วย
  // แม้ว่ามันจะมีผลผูกอยู่แล้วก็ตาม เพราะ getOpenSchedules() คืนเฉพาะรอบที่ "ว่าง" เท่านั้น)
  useEffect(() => {
    fetch("/api/maintenance-plans?openSchedules=true")
      .then((res) => res.json())
      .then((json) => {
        const open: OpenScheduleOption[] = json.data ?? [];
        const all = initialSchedule ? [initialSchedule, ...open] : open;

        const details: Record<string, OpenScheduleOption> = {};
        all.forEach((s) => (details[String(s.scheduleId)] = s));
        setScheduleDetails(details);

        setScheduleOptions(all.map((s) => ({ value: String(s.scheduleId), label: s.label })));
      })
      .catch(() => setErrorMessage("ไม่สามารถโหลดรายชื่อรอบกำหนดการได้ ลองรีเฟรชหน้านี้อีกครั้ง"));
  }, [initialSchedule]);

  function handleSelectSchedule(e: React.ChangeEvent<HTMLSelectElement>) {
    const scheduleId = e.target.value;
    const detail = scheduleDetails[scheduleId];

    setForm((prev) => ({
      ...prev,
      scheduleId,
      registrationNumber: detail?.registrationNumber ?? "",
      maintenancePlanId: detail ? String(detail.maintenancePlanId) : "",
      instrumentType: detail?.instrumentType ?? "",
    }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.scheduleId) {
      setErrorMessage("กรุณาเลือกรอบกำหนดการ");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const url = mode === "edit" ? `/api/calibrations/${calibrationId}` : "/api/calibrations";
      const method = mode === "edit" ? "PATCH" : "POST";

      const body = new FormData();
      body.append("data", JSON.stringify(form));
      if (certificateFile) body.append("certificateFile", certificateFile);

      const res = await fetch(url, { method, body });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        return;
      }

      onSubmitSuccess?.();
    } catch {
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  const resultFieldsByType = {
    BALANCE: { fields: BALANCE_FIELDS, rows: form.resultBalances, empty: emptyResultBalance, key: "resultBalances" as const },
    TEMPERATURE: { fields: TEMPERATURE_FIELDS, rows: form.resultTemperatures, empty: emptyResultTemperature, key: "resultTemperatures" as const },
    PIPETTE: { fields: PIPETTE_FIELDS, rows: form.resultPipettes, empty: emptyResultPipette, key: "resultPipettes" as const },
  };

  const activeResult = form.instrumentType ? resultFieldsByType[form.instrumentType] : null;

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-10">
      {errorMessage && (
        <div className="bg-danger-bg border border-danger-border text-danger-text text-sm px-4 py-3 rounded-xl">
          {errorMessage}
        </div>
      )}

      <div className="bg-card text-card-text p-8 rounded-2xl border border-border shadow-sm space-y-10">
        <Section title="เลือกรอบกำหนดการ">
          <div className="md:col-span-2">
            <SelectInput
              label="อุปกรณ์ + รอบกำหนดการ"
              name="scheduleId"
              value={form.scheduleId}
              onChange={handleSelectSchedule}
              options={scheduleOptions}
              placeholder="เลือกรอบที่จะบันทึกผล"
              required
            />
          </div>
        </Section>

        <Section title="ข้อมูลผลการสอบเทียบ">
          <Input
            label="เลขที่ Certificate"
            name="certificateNo"
            value={form.certificateNo}
            onChange={handleChange}
            required
          />
          <DateInput
            label="วันที่สอบเทียบ"
            name="calibrationDate"
            value={form.calibrationDate}
            onChange={handleChange}
            required
          />
          <Input
            label="ค่าเครื่องมือ (Instrument Value)"
            name="instrumentValue"
            value={form.instrumentValue}
            onChange={handleChange}
            required
          />
          <Input
            label="MPE (Maximum Permissible Error)"
            name="mpe"
            value={form.mpe}
            onChange={handleChange}
            required
          />
          <SelectInput
            label="ผลสรุปการสอบเทียบ"
            name="summaryResult"
            value={form.summaryResult}
            onChange={handleChange}
            options={SUMMARY_RESULT_OPTIONS}
            placeholder="เลือกผลสรุป"
            required
          />

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm text-card-text">
              <input type="checkbox" name="isAccurate" checked={form.isAccurate} onChange={handleCheckbox} />
              ความถูกต้อง
            </label>
            <label className="flex items-center gap-2 text-sm text-card-text">
              <input
                type="checkbox"
                name="isDocumentComplete"
                checked={form.isDocumentComplete}
                onChange={handleCheckbox}
              />
              เอกสารครบถ้วน
            </label>
            <label className="flex items-center gap-2 text-sm text-card-text">
              <input
                type="checkbox"
                name="isInstrumentComplete"
                checked={form.isInstrumentComplete}
                onChange={handleCheckbox}
              />
              เครื่องมือครบถ้วน
            </label>
          </div>

          <Input label="ผู้สอบเทียบ (Operator)" name="operator" value={form.operator} onChange={handleChange} />
          <DateInput label="วันที่ลงบันทึกสอบเทียบ (Operator)" name="operatedAt" value={form.operatedAt} onChange={handleChange} />
          <Input label="ผู้ตรวจสอบ (Reviewer)" name="reviewer" value={form.reviewer} onChange={handleChange} />
          <DateInput label="วันที่ตรวจสอบ (Reviewer)" name="reviewedAt" value={form.reviewedAt} onChange={handleChange} />

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-card-text">ไฟล์ Certificate (PDF/JPEG/PNG/WEBP)</label>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              onChange={(e) => setCertificateFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-mahidol-blue/10 file:text-action-text file:text-sm file:font-medium"
            />
          </div>
        </Section>

        <Section title="ผลการทดสอบ">
          <div className="md:col-span-2">
            {!activeResult && (
              <p className="text-sm text-text-muted">เลือกรอบกำหนดการก่อน ระบบจะแสดงแบบฟอร์มผลทดสอบตามประเภทเครื่องมือ</p>
            )}

            {activeResult && (
              <ResultRowsEditor
                fields={activeResult.fields}
                rows={activeResult.rows as unknown as Record<string, string>[]}
                onChange={(rows) =>
                  setForm((prev) => ({ ...prev, [activeResult.key]: rows as unknown as never }))
                }
              />
            )}
          </div>
        </Section>
      </div>

      <button type="submit" className="hidden" disabled={submitting} />
    </form>
  );
}
