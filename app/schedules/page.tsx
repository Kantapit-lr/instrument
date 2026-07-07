"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MaintenancePlanList } from "@/components/maintenance-plan/MaintenancePlanList";
import { MaintenancePlanItem } from "@/types/maintenancePlan";

export default function SchedulesPage() {
  const [plans, setPlans] = useState<MaintenancePlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadPlans() {
    setLoading(true);
    try {
      const res = await fetch("/api/maintenance-plans");
      const json = await res.json();
      setPlans(json.data ?? []);
    } catch {
      setErrorMessage("ไม่สามารถโหลดรายชื่อกำหนดการได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  async function handleDelete(plan: MaintenancePlanItem) {
    if (!confirm(`ยืนยันลบกำหนดการของโครงการ "${plan.projectName}" ปี พ.ศ. ${plan.year} ?`)) return;

    setErrorMessage(null);

    try {
      const res = await fetch(`/api/maintenance-plans/${plan.maintenancePlanId}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      await loadPlans();
    } catch {
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-card-text">กำหนดการ</h1>
        <Link
          href="/schedules/new"
          className="px-6 py-2.5 text-sm font-semibold text-white bg-mahidol-blue rounded-xl shadow-sm transition-all duration-200 hover:bg-mahidol-blue/90 hover:shadow-md active:scale-[0.98]"
        >
          + สร้างกำหนดการใหม่
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-danger-bg border border-danger-border text-danger-text text-sm px-4 py-3 rounded-xl">
          {errorMessage}
        </div>
      )}

      <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm overflow-hidden">
        <MaintenancePlanList plans={plans} loading={loading} onDelete={handleDelete} />
      </div>
    </div>
  );
}
