"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CalibrationForm } from "@/components/calibration/CalibrationForm";
import { CalibrationFormData, OpenScheduleOption } from "@/types/calibration";
import { InstrumentType } from "@/types/instrument";

const FORM_ID = "calibration-edit-form";

function toDateInputValue(value: unknown): string {
  return value ? new Date(value as string).toISOString().slice(0, 10) : "";
}

function toFormData(raw: Record<string, unknown>): CalibrationFormData {
  const toRows = (list: unknown): Record<string, unknown>[] => (Array.isArray(list) ? list : []);

  return {
    maintenancePlanId: String(raw.maintenancePlanId ?? ""),
    scheduleId: String(raw.scheduleId ?? ""),
    registrationNumber: String(raw.registrationNumber ?? ""),
    instrumentType: ((raw.profile as { type?: string } | undefined)?.type ?? "") as InstrumentType | "",
    certificateNo: String(raw.certificateNo ?? ""),
    calibrationDate: toDateInputValue(raw.calibrationDate),
    isAccurate: Boolean(raw.isAccurate),
    isDocumentComplete: Boolean(raw.isDocumentComplete),
    isInstrumentComplete: Boolean(raw.isInstrumentComplete),
    instrumentValue: String(raw.instrumentValue ?? ""),
    mpe: String(raw.mpe ?? ""),
    summaryResult: (raw.summaryResult as CalibrationFormData["summaryResult"]) ?? "",
    operator: String(raw.operator ?? ""),
    operatedAt: toDateInputValue(raw.operatedAt),
    reviewer: String(raw.reviewer ?? ""),
    reviewedAt: toDateInputValue(raw.reviewedAt),
    resultBalances: toRows(raw.resultBalances).map((r) => ({
      appliedWeight: String(r.appliedWeight ?? ""),
      balanceReading: String(r.balanceReading ?? ""),
      unit: String(r.unit ?? ""),
      correction: String(r.correction ?? ""),
      mu: String(r.mu ?? ""),
      totalErrorMinus: String(r.totalErrorMinus ?? ""),
      totalErrorPlus: String(r.totalErrorPlus ?? ""),
      status: (r.status as CalibrationFormData["summaryResult"]) ?? "",
    })),
    resultTemperatures: toRows(raw.resultTemperatureSources).map((r) => ({
      position: String(r.position ?? ""),
      standardReading: String(r.standardReading ?? ""),
      unit: String(r.unit ?? ""),
      mu: String(r.mu ?? ""),
      averageStandardReadingMc: String(r.averageStandardReadingMc ?? ""),
      status: (r.status as CalibrationFormData["summaryResult"]) ?? "",
    })),
    resultPipettes: toRows(raw.resultPipettes).map((r) => ({
      parameter: String(r.parameter ?? ""),
      pointOfCalibration: String(r.pointOfCalibration ?? ""),
      unit: String(r.unit ?? ""),
      mpePercent: String(r.mpePercent ?? ""),
      error: String(r.error ?? ""),
      ms: String(r.ms ?? ""),
      totalError: String(r.totalError ?? ""),
      status: (r.status as CalibrationFormData["summaryResult"]) ?? "",
    })),
  };
}

function toInitialSchedule(raw: Record<string, unknown>): OpenScheduleOption {
  const profile = raw.profile as { name?: string; type?: string } | undefined;
  const schedule = raw.schedule as { round?: number; scheduledDate?: string } | undefined;

  return {
    scheduleId: Number(raw.scheduleId),
    round: schedule?.round ?? 0,
    registrationNumber: String(raw.registrationNumber ?? ""),
    maintenancePlanId: Number(raw.maintenancePlanId),
    instrumentType: (profile?.type ?? "BALANCE") as InstrumentType,
    label: `${profile?.name ?? ""} (${raw.registrationNumber}) — รอบที่ ${schedule?.round ?? "-"} — กำหนด ${
      schedule?.scheduledDate ? new Date(schedule.scheduledDate).toLocaleDateString("th-TH") : "-"
    }`,
  };
}

export default function EditCalibrationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [initialData, setInitialData] = useState<CalibrationFormData | null>(null);
  const [initialSchedule, setInitialSchedule] = useState<OpenScheduleOption | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/calibrations/${params.id}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json?.data) {
          setInitialData(toFormData(json.data));
          setInitialSchedule(toInitialSchedule(json.data));
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <p className="text-sm text-text-muted max-w-5xl mx-auto">กำลังโหลดข้อมูล...</p>;
  }

  if (notFound || !initialData) {
    return <p className="text-sm text-danger-text max-w-5xl mx-auto">ไม่พบผลสอบเทียบที่ระบุ</p>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-card-text">แก้ไขผลการสอบเทียบ</h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/calibrations")}
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

      <CalibrationForm
        formId={FORM_ID}
        mode="edit"
        calibrationId={Number(params.id)}
        initialData={initialData}
        initialSchedule={initialSchedule}
        onSubmitSuccess={() => setJustSaved(true)}
      />
    </div>
  );
}
