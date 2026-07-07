"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MaintenancePlanForm } from "@/components/maintenance-plan/MaintenancePlanForm";
import { MaintenancePlanFormData } from "@/types/maintenancePlan";

const FORM_ID = "maintenance-plan-edit-form";

// แปลง field ที่ API คืนมาให้เป็นรูปแบบที่ฟอร์มต้องการ (Date -> yyyy-mm-dd, ตัวเลข -> string)
function toFormData(raw: Record<string, unknown>): MaintenancePlanFormData {
  const rawDetails = Array.isArray(raw.maintenanceDetails) ? raw.maintenanceDetails : [];

  return {
    requestListId: String(raw.requestListId ?? ""),
    projectId: String(raw.projectId ?? ""),
    year: String(raw.year ?? ""),
    operator: String(raw.operator ?? ""),
    reviewer: String(raw.reviewer ?? ""),
    approvalStatus: (raw.approvalStatus as MaintenancePlanFormData["approvalStatus"]) ?? "",
    hiringStatus: (raw.hiringStatus as MaintenancePlanFormData["hiringStatus"]) ?? "",
    processStatus: (raw.processStatus as MaintenancePlanFormData["processStatus"]) ?? "",
    details: rawDetails.map((d: Record<string, unknown>) => {
      const profile = d.profile as { name?: string } | undefined;
      const rawSchedules = Array.isArray(d.schedules) ? d.schedules : [];

      return {
        registrationNumber: String(d.registrationNumber ?? ""),
        instrumentLabel: `${profile?.name ?? ""} (${d.registrationNumber})`,
        status: (d.status as MaintenancePlanFormData["details"][number]["status"]) ?? "",
        detail: String(d.detail ?? ""),
        remark: String(d.remark ?? ""),
        schedules: rawSchedules.map((s: Record<string, unknown>) => ({
          round: String(s.round ?? ""),
          scheduledDate: s.scheduledDate ? new Date(s.scheduledDate as string).toISOString().slice(0, 10) : "",
        })),
      };
    }),
  };
}

export default function EditSchedulePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [initialData, setInitialData] = useState<MaintenancePlanFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/maintenance-plans/${params.id}`)
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
  }, [params.id]);

  if (loading) {
    return <p className="text-sm text-text-muted max-w-5xl mx-auto">กำลังโหลดข้อมูล...</p>;
  }

  if (notFound || !initialData) {
    return (
      <p className="text-sm text-danger-text max-w-5xl mx-auto">
        ไม่พบกำหนดการที่ระบุ
      </p>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-card-text">แก้ไขกำหนดการ</h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/schedules")}
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

      <MaintenancePlanForm
        formId={FORM_ID}
        mode="edit"
        maintenancePlanId={Number(params.id)}
        initialData={initialData}
        onSubmitSuccess={() => setJustSaved(true)}
      />
    </div>
  );
}
