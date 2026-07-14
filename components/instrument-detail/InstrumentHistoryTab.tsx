"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/new-instrument/Input";
import { SelectInput } from "@/components/new-instrument/SelectInput";
import { DateInput } from "@/components/new-instrument/DateInput";
import { HistoryList } from "./HistoryList";
import { InstrumentHistoryTabProps } from "@/types/components";
import { HistoryItem, HistoryFormData, emptyHistoryForm } from "@/types/profileDetail";
import { SelectOption } from "@/types/instrument";

const ACTION_TYPE_OPTIONS: SelectOption[] = [
  { value: "CAL", label: "สอบเทียบ (CAL)" },
  { value: "PM", label: "บำรุงรักษาเชิงป้องกัน (PM)" },
  { value: "TRANSFER", label: "ย้ายสถานที่ (TRANSFER)" },
  { value: "MANUAL", label: "บันทึกทั่วไป (MANUAL)" },
  { value: "OTHER", label: "อื่นๆ (OTHER)" },
];

export function InstrumentHistoryTab({ registrationNumber }: InstrumentHistoryTabProps) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<HistoryFormData>(emptyHistoryForm);
  const [submitting, setSubmitting] = useState(false);

  async function loadHistory() {
    setLoading(true);
    try {
      const res = await fetch(`/api/instruments/${registrationNumber}/history`);
      const json = await res.json();
      setItems(json.data ?? []);
    } catch {
      setErrorMessage("ไม่สามารถโหลดประวัติได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationNumber]);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyHistoryForm);
    setShowForm(true);
  }

  function openEditForm(item: HistoryItem) {
    setEditingId(item.historyId);
    setForm({
      actionDate: item.actionDate.slice(0, 10),
      actionType: item.actionType as HistoryFormData["actionType"],
      detail: item.detail ?? "",
      operator: item.operator,
      remark: item.remark ?? "",
    });
    setShowForm(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const url = editingId ? `/api/history/${editingId}` : `/api/instruments/${registrationNumber}/history`;
      const method = editingId ? "PATCH" : "POST";

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

      setShowForm(false);
      await loadHistory();
    } catch {
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(item: HistoryItem) {
    if (!confirm("ยืนยันลบรายการประวัตินี้?")) return;

    setErrorMessage(null);

    try {
      const res = await fetch(`/api/history/${item.historyId}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      await loadHistory();
    } catch {
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    }
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="bg-danger-bg border border-danger-border text-danger-text text-sm px-4 py-3 rounded-xl">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end">
        {!showForm && (
          <button
            type="button"
            onClick={openAddForm}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-mahidol-blue rounded-xl shadow-sm transition-all duration-200 hover:bg-mahidol-blue/90 hover:shadow-md active:scale-[0.98]"
          >
            + เพิ่มประวัติ
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card text-card-text rounded-2xl border border-border shadow-sm p-5 space-y-4"
        >
          <p className="text-sm font-semibold text-card-text">
            {editingId ? "แก้ไขประวัติ" : "เพิ่มประวัติใหม่"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateInput label="วันที่" name="actionDate" value={form.actionDate} onChange={handleChange} required />
            <SelectInput
              label="ประเภท"
              name="actionType"
              value={form.actionType}
              onChange={handleChange}
              options={ACTION_TYPE_OPTIONS}
              required
            />
            <Input label="รายละเอียด" name="detail" value={form.detail} onChange={handleChange} />
            <Input label="ผู้ดำเนินการ  " name="operator" value={form.operator} onChange={handleChange} required />
            <div className="md:col-span-2">
              <Input label="หมายเหตุ" name="remark" value={form.remark} onChange={handleChange} />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-mahidol-blue rounded-xl shadow-sm hover:bg-mahidol-blue/90 transition-colors disabled:opacity-60"
            >
              บันทึก
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 text-sm font-semibold text-card-text bg-card border border-border rounded-xl hover:bg-surface-muted transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      )}

      <HistoryList items={items} loading={loading} onEdit={openEditForm} onDelete={handleDelete} />
    </div>
  );
}
