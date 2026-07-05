"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import InstrumentForm from "@/components/new-instrument/InstrumentForm";
import { InstrumentFormData } from "@/types/instrument";

const FORM_ID = "instrument-edit-form";

// แปลง field ที่ API คืนมา (Decimal เป็น string, Date เป็น ISO string) ให้เป็น string
// ตามรูปแบบที่ฟอร์ม/input ต้องการ (input type="date" ต้องการ yyyy-mm-dd ไม่ใช่ ISO เต็ม)
function toFormData(raw: Record<string, unknown>): InstrumentFormData {
  function toDateInputValue(value: unknown): string {
    if (!value) return "";
    return new Date(value as string).toISOString().slice(0, 10);
  }

  const rawSpecs = Array.isArray(raw.specialCharacteristics) ? raw.specialCharacteristics : [];

  return {
    registrationNumber: String(raw.registrationNumber ?? ""),
    name: String(raw.name ?? ""),
    type: (raw.type as InstrumentFormData["type"]) ?? "",
    brand: String(raw.brand ?? ""),
    model: String(raw.model ?? ""),
    serialNo: String(raw.serialNo ?? ""),
    projectId: String(raw.projectId ?? ""),
    size: String(raw.size ?? ""),
    manufacturer: String(raw.manufacturer ?? ""),
    vendor: String(raw.vendor ?? ""),
    country: String(raw.country ?? ""),
    price: String(raw.price ?? ""),
    fundingType: String(raw.fundingType ?? ""),
    fundingTypeRemark: String(raw.fundingTypeRemark ?? ""),
    location: String(raw.location ?? ""),
    receivedDate: toDateInputValue(raw.receivedDate),
    activeDate: toDateInputValue(raw.activeDate),
    initialCondition: String(raw.initialCondition ?? ""),
    withdrawalDocumentNo: String(raw.withdrawalDocumentNo ?? ""),
    recordedBy: String(raw.recordedBy ?? ""),
    remark: String(raw.remark ?? ""),
    specialCharacteristics: rawSpecs.map((s: Record<string, unknown>) => ({
      type: String(s.type ?? ""),
      value: String(s.value ?? ""),
      remark: String(s.remark ?? ""),
    })),
  };
}

export default function EditInstrumentPage() {
  const params = useParams<{ registrationNumber: string }>();
  const router = useRouter();

  const [initialData, setInitialData] = useState<InstrumentFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/instruments/${params.registrationNumber}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json?.data) setInitialData(toFormData(json.data));
      })
      .finally(() => setLoading(false));
  }, [params.registrationNumber]);

  async function handleDelete() {
    if (
      !confirm(
        "ยืนยันลบอุปกรณ์นี้? การลบจะลบรูปภาพทั้งหมดของอุปกรณ์นี้ด้วย และไม่สามารถย้อนกลับได้"
      )
    ) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/instruments/${params.registrationNumber}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        setDeleteError(json.error ?? "ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      router.push("/instruments");
    } catch {
      setDeleteError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-text-muted max-w-5xl mx-auto">กำลังโหลดข้อมูล...</p>;
  }

  if (notFound || !initialData) {
    return (
      <p className="text-sm text-danger-text max-w-5xl mx-auto">
        ไม่พบอุปกรณ์ที่ระบุ (รหัสครุภัณฑ์ &ldquo;{params.registrationNumber}&rdquo;)
      </p>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-card-text">แก้ไขอุปกรณ์</h1>
        <div className="flex gap-3">
          {/* ปุ่มลบ: ย้ายมาอยู่ในหน้าแก้ไขแทนหน้า list/search ตามที่ตกลงกัน */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-6 py-2.5 text-sm font-semibold text-danger-text bg-danger-bg border border-danger-border rounded-xl shadow-sm transition-all duration-200 hover:opacity-80 active:scale-[0.98] disabled:opacity-60"
          >
            {deleting ? "กำลังลบ..." : "ลบอุปกรณ์นี้"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/instruments")}
            className="px-6 py-2.5 text-sm font-semibold text-card-text bg-card border border-border rounded-xl shadow-sm transition-all duration-200 hover:bg-surface-muted active:scale-[0.98]"
          >
            {justSaved ? "เสร็จสิ้น กลับหน้ารายการ" : "ยกเลิก"}
          </button>

          <button
            type="submit"
            form={FORM_ID}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-mahidol-blue rounded-xl shadow-sm transition-all duration-200 hover:bg-mahidol-blue/90 hover:shadow-md active:scale-[0.98]"
          >
            บันทึกการแก้ไข
          </button>
        </div>
      </div>

      {deleteError && (
        <div className="bg-danger-bg border border-danger-border text-danger-text text-sm px-4 py-3 rounded-xl">
          {deleteError}
        </div>
      )}

      <InstrumentForm
        formId={FORM_ID}
        mode="edit"
        initialData={initialData}
        onSubmitSuccess={() => setJustSaved(true)}
      />
    </div>
  );
}
