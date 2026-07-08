"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/new-instrument/Input";
import { SelectInput } from "@/components/new-instrument/SelectInput";
import { Section } from "@/components/new-instrument/Section";
import { MaintenanceDetailCard } from "./MaintenanceDetailCard";
import {
  emptyMaintenancePlanForm,
  emptySchedule,
  MaintenancePlanFormData,
  MaintenanceDetailInput,
} from "@/types/maintenancePlan";
import { SelectOption } from "@/types/instrument";
import { MaintenancePlanFormProps } from "@/types/components";

const APPROVAL_STATUS_OPTIONS: SelectOption[] = [
  { value: "รอดำเนินการ", label: "รอดำเนินการ" },
  { value: "อยู่ระหว่างการตรวจสอบ", label: "อยู่ระหว่างการตรวจสอบ" },
  { value: "อนุมัติ", label: "อนุมัติ" },
  { value: "ไม่อนุมัติ", label: "ไม่อนุมัติ" },
];

const HIRING_STATUS_OPTIONS: SelectOption[] = [
  { value: "ยังไม่มีการดำเนินการ", label: "ยังไม่มีการดำเนินการ" },
  { value: "บางส่วน", label: "บางส่วน" },
  { value: "เสร็จสิ้น", label: "เสร็จสิ้น" },
];

const PROCESS_STATUS_OPTIONS: SelectOption[] = [
  { value: "อยู่ระหว่างการดำเนินการ", label: "อยู่ระหว่างการดำเนินการ" },
  { value: "เสร็จสิ้น", label: "เสร็จสิ้น" },
];

// RequestDetail ดิบที่ได้จาก GET /api/request-lists/[id]
interface RawRequestDetail {
  registrationNumber: string;
  frequency: number;
  profile: { name: string };
}

export function MaintenancePlanForm({
  formId,
  mode = "create",
  maintenancePlanId,
  initialData,
  onSubmitSuccess,
}: MaintenancePlanFormProps) {
  const [form, setForm] = useState<MaintenancePlanFormData>(initialData ?? emptyMaintenancePlanForm);
  const [requestListOptions, setRequestListOptions] = useState<SelectOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // โหลดรายชื่อแผนรายปีที่ "อนุมัติแล้ว" เท่านั้น (เลือกได้แค่แผนที่พร้อมทำกำหนดการ)
  useEffect(() => {
    fetch("/api/request-lists?options=true")
      .then((res) => res.json())
      .then((json) => setRequestListOptions(json.data ?? []))
      .catch(() => setErrorMessage("ไม่สามารถโหลดรายชื่อแผนรายปีได้ ลองรีเฟรชหน้านี้อีกครั้ง"));
  }, []);

  // โหมดแก้ไข: โหลดชื่ออุปกรณ์มาแสดง (initialData ไม่มีชื่ออุปกรณ์ ผูกมาจาก instrumentLabel อยู่แล้ว
  // จากหน้า edit ที่ประกอบมาให้ตอน map ข้อมูล จึงไม่ต้องดึงซ้ำในนี้)

  // เมื่อเลือกแผนรายปี (โหมดสร้างใหม่เท่านั้น) ให้ดึงรายละเอียดแผนมาเติม projectId, year,
  // และสร้างรายการอุปกรณ์ (details) พร้อม schedule เปล่าตามจำนวนความถี่ที่ระบุไว้ในแผน
  async function handleSelectRequestList(e: React.ChangeEvent<HTMLSelectElement>) {
    const requestListId = e.target.value;
    setForm((prev) => ({ ...prev, requestListId }));

    if (!requestListId) return;

    try {
      const res = await fetch(`/api/request-lists/${requestListId}`);
      const json = await res.json();
      const raw = json.data;
      if (!raw) return;

      const details: MaintenanceDetailInput[] = (raw.requestDetails as RawRequestDetail[]).map(
        (d) => {
          const label = `${d.profile.name} (${d.registrationNumber})`;
          return {
            registrationNumber: d.registrationNumber,
            instrumentLabel: label,
            status: "",
            detail: "",
            remark: "",
            schedules: Array.from({ length: Math.max(1, d.frequency) }, (_, i) => ({
              ...emptySchedule,
              round: String(i + 1),
            })),
          };
        }
      );

      setForm((prev) => ({
        ...prev,
        requestListId,
        projectId: String(raw.projectId ?? ""),
        year: String(raw.year ?? ""),
        details,
      }));
    } catch {
      setErrorMessage("ไม่สามารถโหลดรายละเอียดแผนที่เลือกได้");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateDetail(index: number, detail: MaintenanceDetailInput) {
    setForm((prev) => {
      const updated = [...prev.details];
      updated[index] = detail;
      return { ...prev, details: updated };
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.requestListId) {
      setErrorMessage("กรุณาเลือกแผนรายปี");
      return;
    }
    if (form.details.length === 0) {
      setErrorMessage("แผนที่เลือกยังไม่มีอุปกรณ์ กรุณาเลือกแผนอื่น");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const url = mode === "edit" ? `/api/maintenance-plans/${maintenancePlanId}` : "/api/maintenance-plans";
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
        <Section title="ข้อมูลกำหนดการ">
          <SelectInput
            label="แผนรายปี (ที่อนุมัติแล้ว)"
            name="requestListId"
            value={form.requestListId}
            onChange={handleSelectRequestList}
            options={requestListOptions}
            placeholder="เลือกแผนรายปี"
            required
          />
          {mode === "edit" && (
            <p className="md:col-span-2 text-xs text-text-muted -mt-4">
              ไม่สามารถเปลี่ยนแผนรายปีของกำหนดการที่สร้างไปแล้วได้ หากเลือกผิด แนะนำให้ลบแล้วสร้างใหม่
            </p>
          )}
          <Input
            label="ผู้ดำเนินการ (Operator)"
            name="operator"
            value={form.operator}
            onChange={handleChange}
            required
          />
          <Input
            label="ผู้ตรวจสอบ (Reviewer)"
            name="reviewer"
            value={form.reviewer}
            onChange={handleChange}
          />
          <SelectInput
            label="สถานะการอนุมัติ"
            name="approvalStatus"
            value={form.approvalStatus}
            onChange={handleChange}
            options={APPROVAL_STATUS_OPTIONS}
            placeholder="เลือกสถานะ"
            required
          />
          <SelectInput
            label="สถานะการจัดจ้าง"
            name="hiringStatus"
            value={form.hiringStatus}
            onChange={handleChange}
            options={HIRING_STATUS_OPTIONS}
            placeholder="เลือกสถานะ"
            required
          />
          <SelectInput
            label="สถานะการดำเนินงาน"
            name="processStatus"
            value={form.processStatus}
            onChange={handleChange}
            options={PROCESS_STATUS_OPTIONS}
            placeholder="เลือกสถานะ"
            required
          />
        </Section>

        <Section title="อุปกรณ์ในกำหนดการ">
          <div className="md:col-span-2 space-y-4">
            {form.details.length === 0 && (
              <p className="text-sm text-text-muted">เลือกแผนรายปีก่อน ระบบจะดึงรายชื่ออุปกรณ์มาให้อัตโนมัติ</p>
            )}

            {form.details.map((detail, index) => (
              <MaintenanceDetailCard
                key={detail.registrationNumber}
                detail={detail}
                index={index}
                onChange={updateDetail}
              />
            ))}
          </div>
        </Section>
      </div>

      <button type="submit" className="hidden" disabled={submitting} />
    </form>
  );
}
