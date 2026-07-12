"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnnualPlanForm } from "@/components/annual-plan/AnnualPlanForm";
import { RequestListFormData } from "@/types/annualPlan";

const FORM_ID = "annual-plan-edit-form";

// แปลง field ที่ API คืนมา (Decimal เป็น string) ให้เป็น string ตามรูปแบบที่ฟอร์มต้องการ
function toFormData(raw: Record<string, unknown>): RequestListFormData {
  const rawDetails = Array.isArray(raw.requestDetails) ? raw.requestDetails : [];

  return {
    projectId: String(raw.projectId ?? ""),
    year: String(raw.year ?? ""),
    operator: String(raw.operator ?? ""),
    status: (raw.status as RequestListFormData["status"]) ?? "",
    details: rawDetails.map((d: Record<string, unknown>) => ({
      registrationNumber: String(d.registrationNumber ?? ""),
      requirementType: (d.requirementType as RequestListFormData["details"][number]["requirementType"]) ?? "",
      frequency: String(d.frequency ?? ""),
      usagePeriod: String(d.usagePeriod ?? ""),
      acceptableTolerance: String(d.acceptableTolerance ?? ""),
      remark: String(d.remark ?? ""),
    })),
  };
}

export default function EditAnnualPlanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [initialData, setInitialData] = useState<RequestListFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/request-lists/${params.id}`)
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
        ไม่พบแผนรายปีที่ระบุ
      </p>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-card-text">แก้ไขแผนรายปี</h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/annual-plans")}
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

      <AnnualPlanForm
        formId={FORM_ID}
        mode="edit"
        requestListId={Number(params.id)}
        initialData={initialData}
        onSubmitSuccess={() => setJustSaved(true)}
      />
    </div>
  );
}
