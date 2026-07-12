"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalibrationList } from "@/components/calibration/CalibrationList";
import { CalibrationItem } from "@/types/calibration";

export default function CalibrationsPage() {
  const [calibrations, setCalibrations] = useState<CalibrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadCalibrations() {
    setLoading(true);
    try {
      const res = await fetch("/api/calibrations");
      const json = await res.json();
      setCalibrations(json.data ?? []);
    } catch {
      setErrorMessage("ไม่สามารถโหลดรายการผลสอบเทียบได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCalibrations();
  }, []);

  async function handleDelete(calibration: CalibrationItem) {
    if (!confirm(`ยืนยันลบผลสอบเทียบของ "${calibration.instrumentName}" (เลขที่ ${calibration.certificateNo}) ?`))
      return;

    setErrorMessage(null);

    try {
      const res = await fetch(`/api/calibrations/${calibration.calibrationId}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      await loadCalibrations();
    } catch {
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-card-text">บันทึกผลการสอบเทียบ</h1>
        <Link
          href="/calibrations/new"
          className="px-6 py-2.5 text-sm font-semibold text-white bg-mahidol-blue rounded-xl shadow-sm transition-all duration-200 hover:bg-mahidol-blue/90 hover:shadow-md active:scale-[0.98]"
        >
          + บันทึกผลใหม่
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-danger-bg border border-danger-border text-danger-text text-sm px-4 py-3 rounded-xl">
          {errorMessage}
        </div>
      )}

      <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm overflow-hidden">
        <CalibrationList calibrations={calibrations} loading={loading} onDelete={handleDelete} />
      </div>
    </div>
  );
}
