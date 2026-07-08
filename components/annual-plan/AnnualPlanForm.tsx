"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/new-instrument/Input";
import { SelectInput } from "@/components/new-instrument/SelectInput";
import { Section } from "@/components/new-instrument/Section";
import { RequestDetailRow } from "./RequestDetailRow";
import {
  emptyRequestListForm,
  emptyRequestDetail,
  RequestListFormData,
} from "@/types/annualPlan";
import { SelectOption } from "@/types/instrument";
import { AnnualPlanFormProps } from "@/types/components";

const STATUS_OPTIONS: SelectOption[] = [
  { value: "ร่าง", label: "ร่าง" },
  { value: "เสนอแล้ว", label: "เสนอแล้ว" },
  { value: "อนุมัติแล้ว", label: "อนุมัติแล้ว" },
];

export function AnnualPlanForm({
  formId,
  mode = "create",
  requestListId,
  initialData,
  onSubmitSuccess,
}: AnnualPlanFormProps) {
  const [form, setForm] = useState<RequestListFormData>(initialData ?? emptyRequestListForm);
  const [projectOptions, setProjectOptions] = useState<SelectOption[]>([]);
  const [instrumentOptions, setInstrumentOptions] = useState<SelectOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // โหลดรายชื่อโครงการ (dropdown เดียวกับหน้าเพิ่มอุปกรณ์ใหม่)
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((json) => setProjectOptions(json.data ?? []))
      .catch(() => setErrorMessage("ไม่สามารถโหลดรายชื่อโครงการได้ ลองรีเฟรชหน้านี้อีกครั้ง"));
  }, []);

  // โหลดรายชื่ออุปกรณ์ใหม่ทุกครั้งที่เปลี่ยนโครงการ (แผนรายปีเป็นของโครงการเดียว
  // จึงกรองให้เลือกได้เฉพาะอุปกรณ์ของโครงการที่เลือกไว้เท่านั้น)
  useEffect(() => {
    if (!form.projectId) {
      setInstrumentOptions([]);
      return;
    }

    fetch(`/api/instruments?options=true&projectId=${form.projectId}`)
      .then((res) => res.json())
      .then((json) => setInstrumentOptions(json.data ?? []))
      .catch(() => setErrorMessage("ไม่สามารถโหลดรายชื่ออุปกรณ์ได้ ลองรีเฟรชหน้านี้อีกครั้ง"));
  }, [form.projectId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function addDetail() {
    setForm((prev) => ({ ...prev, details: [...prev.details, { ...emptyRequestDetail }] }));
  }

  function updateDetail(index: number, detail: (typeof form.details)[number]) {
    setForm((prev) => {
      const updated = [...prev.details];
      updated[index] = detail;
      return { ...prev, details: updated };
    });
  }

  function removeDetail(index: number) {
    setForm((prev) => ({ ...prev, details: prev.details.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.details.length === 0) {
      setErrorMessage("กรุณาเพิ่มอุปกรณ์เข้าแผนอย่างน้อย 1 รายการ");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const url = mode === "edit" ? `/api/request-lists/${requestListId}` : "/api/request-lists";
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

      onSubmitSuccess?.();
    } catch {
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-10">
      {errorMessage && (
        <div className="bg-danger-bg border border-danger-border text-danger-text text-sm px-4 py-3 rounded-xl">
          {errorMessage}
        </div>
      )}

      <div className="bg-card text-card-text p-8 rounded-2xl border border-border shadow-sm space-y-10">
        <Section title="ข้อมูลแผน">
          <SelectInput
            label="โครงการ (Project)"
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            options={projectOptions}
            placeholder="เลือกโครงการ"
            required
          />
          <Input
            label="ปี (พ.ศ.)"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            required
          />
          <Input
            label="ผู้เสนอแผน (Operator)"
            name="operator"
            value={form.operator}
            onChange={handleChange}
            required
          />
          <SelectInput
            label="สถานะ"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={STATUS_OPTIONS}
            placeholder="เลือกสถานะ"
            required
          />
        </Section>

        <Section title="รายการอุปกรณ์ในแผน">
          <div className="md:col-span-2 space-y-4">
            {!form.projectId && (
              <p className="text-sm text-text-muted">กรุณาเลือกโครงการก่อน ถึงจะเพิ่มอุปกรณ์เข้าแผนได้</p>
            )}

            {form.projectId && form.details.length === 0 && (
              <p className="text-sm text-text-muted">ยังไม่มีอุปกรณ์ในแผน กดปุ่มด้านล่างเพื่อเพิ่ม</p>
            )}

            {form.details.map((detail, index) => (
              <RequestDetailRow
                key={index}
                detail={detail}
                index={index}
                instrumentOptions={instrumentOptions}
                onChange={updateDetail}
                onRemove={removeDetail}
              />
            ))}

            <button
              type="button"
              onClick={addDetail}
              disabled={!form.projectId}
              className="text-sm font-medium text-action-text hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
            >
              + เพิ่มอุปกรณ์เข้าแผน
            </button>
          </div>
        </Section>
      </div>

      <button type="submit" className="hidden" disabled={submitting} />
    </form>
  );
}
